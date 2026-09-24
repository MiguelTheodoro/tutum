import Elysia, { t, file } from 'elysia'
import { PrismaClient } from '../../generated/prisma'
import * as Database from '../Database'






const List = new Elysia({ name: 'analysis-list' }).get('analyses', async (Context) => {

    const analysis = await Database.Analysis(new PrismaClient)

    const data = await analysis.get.element({ take: 10, select: { identity: true, evaluation: true, state: true, status: true } }) 

    return { data: data ?? [] }

})


const State = new Elysia({ name: 'analysis-state' }).get('analyses/state/:identity', async ({ params: { identity } }) => {

    const analysis = await Database.Analysis(new PrismaClient)

    const data = await analysis.get.element({ select: { identity: true, state: true }, where: { identity } }) 

    return { data: data ?? [] }


}, { params: t.Object({ identity: t.String({ readOnly: true, minLength: 36, maxLength: 36 }) }) })



const Details = new Elysia({ name: 'analyses-inspect' }).get('analyses/:identity', async ({ params: { identity } }) => {

    const analysis = await Database.Analysis(new PrismaClient)

    const data = await analysis.get.element({ where: { identity } })

    return { data: data ?? {} }


}, { params: t.Object({ identity: t.String({ readOnly: true, minLength: 36, maxLength: 36 }) }) })


const Blob = new Elysia({ name: 'analyses-inspect' }).get('analyses/evaluation/:identity', async ({ params: { identity } }) => {

    const analysis = await Database.Analysis(new PrismaClient)

    const [ data ] = await analysis.get.element({ where: { identity }, select: { evaluation: true } })



    return data.evaluation
 

}, { params: t.Object({ identity: t.String({ readOnly: true, minLength: 36, maxLength: 36 }) }) })



export const Analyses = new Elysia({ name: 'files '}).use(Blob).use(List).use(Details).use(State)


