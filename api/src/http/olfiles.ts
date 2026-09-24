import Elysia, { t, file } from "elysia";
import { PrismaClient } from "../../generated/prisma";
import { normalize, extname } from "node:path"

import * as Database from "../Database";

type $Controller = () => { identity: string; name: string; type: string }[];

const List = new Elysia({ name: "files-list" }).get("files", async ({ query }) => {
  
  const file = await Database.File(new PrismaClient());


  console.clear()
  
  
   return await file.get.unrelatedElement({
      select: { identity: true, name: true, size: true, path: true, hash: true },
      where: { 

        ...(query.filter ? { 
          OR: [
            { name: { contains: query.filter } }, 
            { path: { endsWith: query.filter } }
          ] } : {}),
        ...(query.classified ? { analysis: { is: { state: String(query.classified).toLocaleUpperCase() } } }: {})

      },
    });
  

  },
  {
    query: t.Object({
      filter: t.Optional(t.Any()),
      classified: t.Optional(t.UnionEnum(["safe", "malicius", "undefined"])),
    }),
  },
);

const Details = new Elysia({ name: "files-inspect" }).get(
  "files/:identity",
  async ({ params: { identity } }) => {
    const file = await Database.File(new PrismaClient());

    const data = await file.get.element({ where: { identity } });
    console.log(data)

    return data[0];
  },
  {
    params: t.Object({
      identity: t.String({ readOnly: true, minLength: 36, maxLength: 36 }),
    }),
  },
);



const View = new Elysia().get("files/blob/:identity", async ({ params: { identity}, set }) => {


  const filedatabase = await Database.File(new PrismaClient())

  const [ data ] = await filedatabase.get.unrelatedElement({ where: { identity }, select: { path: true, type: true, name: true } })

  if(data)

    return file(data.path)


}, {
  params: t.Object({
    identity: t.String({ readOnly: true, minLength: 36, maxLength: 36 }),
  }),
})


export const Files = new Elysia({ name: "files " }).use(View)
  .onAfterHandle(({ response }) => {

    if (typeof response !== "string") response = { data: response ?? [] };

    return response

  })
  .use(List)
  .use(Details);
