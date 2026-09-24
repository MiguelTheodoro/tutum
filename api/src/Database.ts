import { FileCreateWithoutAnalysisInput, FileCreateInput } from './../generated/prisma/index.d';
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { Prisma } from "../generated/prisma"
import { PrismaClient } from "../generated/prisma"
import type { File as $FileFromImport, Analysis as $Analysis } from "../generated/prisma"
import { onError } from "./Error"

export type $File = $FileFromImport;


export const File = (client: PrismaClient) => {

    return {

        client,

        get: {

            hash: onError(async (argument: Prisma.FileFindManyArgs<DefaultArgs> | undefined = {}) => {
                
                return await client.file.findMany({ ...argument, select: { hash: true } })

            }),
            
            element: onError(async (argument:  Prisma.FileFindManyArgs<DefaultArgs>) => {
                
                return await client.file.findMany({ ...argument, include: { analysis: { select: { identity: true, evaluation: true, state: true, status: true }}}})
                
            }),

            unrelatedElement: onError(async (argument:  Prisma.FileFindManyArgs<DefaultArgs>) => {
                
                return await client.file.findMany({ ...argument })
                
            }),

            elementWithoutAnalysis: onError(async (argument:  Prisma.FileFindManyArgs<DefaultArgs>) => {
                
                return await client.file.findMany({...argument, select: { identity: true, hash: true, path: true, analysis: { select: { identity: true }} }, where: { analysis: { state: 'UNDEFINED' } }, orderBy: { lastModified: 'desc' } })
                
            }),

            elementInAnalysis: onError(async (argument:  Prisma.FileFindManyArgs<DefaultArgs>) => {
                
                return await client.file.findMany({...argument, select: { identity: true, hash: true, path: true, analysis: { select: { identity: true, evaluation: true }} }, where: { analysis: { state: 'UNDEFINED', status: 'IN_PROCESSING' } }, orderBy: { lastModified: 'desc' } })
                
            })

        },

        add: {

            element: onError(async (file:  (Prisma.FileCreateWithoutAnalysisInput)[]) => {

                for(const entity of file)

                    await client.file.create({ data: { ...entity, analysis: { create: { } } }})

            }),


            elementWithAnalysis: onError(async (entity: { file: Prisma.FileCreateInput, analysis: { state: "UNDEFINED" | "SAFE" | "MALICIOUS", status: 'PROCESSED' | 'IN_PROCESSING' | 'UNPROCESSED', evaluation: any }}) =>  {

                await client.file.create({ data: { ...(entity.file), analysis: { create:  { evaluation: entity.analysis.evaluation, state: entity.analysis.state, status: entity.analysis.status }}} })
x
            }),


            
            unrelatedElement: onError(async (file:  Prisma.FileCreateManyInput) => {
                
                return await client.file.create({ data: file })
                
            })

        },

        remove: {

            element: onError(async (file:  (Prisma.FileCreateManyInput)[]) => {

                for (const entity of file){

                    await client.file.delete({ where: { hash: entity.hash }})

                }


            }),

            elementWithHash: onError(async (hash: string[]) => {

                for (const entity of hash){

                    await client.file.delete({ where: { hash: entity }})

                }

            })

        }

    }
}



export const Analysis = (client: PrismaClient) => {

    return {

        client, 

        get: { 
            
            element: onError(async (argument: Prisma.AnalysisFindManyArgs<DefaultArgs>) => {

                return await client.analysis.findMany(argument)

            }),

            evaluation: onError(async (argument: Prisma.AnalysisFindManyArgs<DefaultArgs>) => {
                
                return await client.analysis.findMany({ ...argument, select: { identity: true, evaluation: true }})

            }),

            /*elementInProcess: onError(async (argument:  Prisma.FileFindManyArgs<DefaultArgs>) => {
                
                return await client.analysis.findMany({...argument, select: { identity: true, evaluation: true, linkWithFile: { select: { identity: true }}}, include: { linkWithFile: { select: { lastModified: true } }}, where: { state: 'UNDEFINED', status: 'IN_PROCESSING' }, orderBy: { linkWithFile: { lastModified: 'desc' } }})
                
            })*/

        },

        add: {

            element: onError(async (analysis: Prisma.AnalysisCreateManyInput[]) => {

                const result = await client.analysis.createMany({ data: analysis  })

            })

        },

        update: {

            element: onError(async (analysis: { identity: string, state: "UNDEFINED" | "SAFE" | "MALICIOUS", status: 'PROCESSED' | 'IN_PROCESSING' | 'UNPROCESSED', evaluation: any }) => {

                return await client.analysis.update({ data: { evaluation: analysis.evaluation, state: analysis.state, status: analysis.status }, where: { identity: analysis.identity }})

            }),

            status: onError(async (analysis: { identity: string, status: 'PROCESSED' | 'IN_PROCESSING' | 'UNPROCESSED' }) => {

                return await client.analysis.update({ data: { status: analysis.status }, where: { identity: analysis.identity }})

            })

        }

    }

}








// get Hash, $File, 
// add $File {name, type, size, lastModified, hash}
// add Anysys