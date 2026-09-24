import { Elysia, t } from "elysia";
import { Files } from "./http/files";
import { Analyses } from "./http/analyses";
import { cors } from "@elysia/cors"

const Core = new Elysia({ name: 'core' })


const Routes = new Elysia({ name: 'routes' }).use(Analyses).use(Files)


Core.use(cors()).use(Routes).listen(5000)




console.log(
  `🦊 Elysia is running at http://${Core.server?.hostname}:${Core.server?.port}`
);
