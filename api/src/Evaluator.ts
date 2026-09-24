import { onError } from "./Error"
import { Build } from "./External"
import * as Database from "./Database"
import { PrismaClient } from "../generated/prisma"
import * as Archive from "./Archive"
import { styleText } from 'node:util'
const shortFile = Symbol('shortFile')

const largeFile = Symbol('largeFile')



type $Config = { endpoint: string, method: 'GET' | 'POST' }




export const Analysis = (pass: string) => {

    if(!pass) throw new Error("")

    const onRequest = Build.Request("https://www.virustotal.com/api/v3/", { headers: { 'X-Apikey': pass, 'Accept': 'application/json' }})

    return {

        pass,

        get: { 
            
           file: onError(onRequest(async (identity: string) => {
            
                return { param: identity }

           }, { endpoint: "analyses", method: "GET" }))

        },

        post: { 

            file: onError(onRequest(async (file: Blob) => {

                const body = new FormData()

                body.set("file", file)

                return { body }

            }, { endpoint: "files", method: "POST" }))

        }
         
    }

}

export type $AnalysisResponse = {
    data: {
        id: string,
        attributes: {
            /*"last_analysis_stats": {
                malicious: number,
                suspicious: number,
                undetected:  number,
                harmless: number,
                timeout: number,
                "confirmed-timeout": number,
                failure: number,
                "type-unsupported": number,
            },*/

            stats: {
                malicious: number,
                suspicious: number,
                undetected:  number,
                harmless: number,
                timeout: number,
                "confirmed-timeout": number,
                failure: number,
                "type-unsupported": number,
            },
            status: "queued" | "completed" | "in-progress"
        }
    }
}

/*
export const Routine = (pass: string) => {

    const request  = Analysis(pass)

    const client = new PrismaClient

    const file = Database.File(client)

    const analysis = Database.Analysis(client)


    return {

        request,

        file,

        analysis,

        update: {

            analysis: {

                inprocess: onError(async () => {
                    
                    const entitys   = await file.get.elementInAnalysis({ take: 3 }) as { identity: string, hash: string, path: string, analysis: { identity: string, evaluation: $AnalysisResponse }}[] 

                    //const analysis = Promise.all(entitys.map(async (file) => request.post.file.bind(null, await (await Archive.Element(file.path)).blob())))

                    console.log("Inprocess Evaluator.js entity -> ", entitys)
                    //console.log("analysis -> ", analysis)



                    
                    for (const entity of entitys){


                        const getAnalysis = await request.get.file(entity.analysis.evaluation.data.id)

                        
                        if(!getAnalysis.ok || getAnalysis.status !== 200){

                            console.log(styleText("redBright", "------------------------------------------------"))
                            console.log("`{ ${entity.path} } analysis -> ", getAnalysis)
                            console.log(styleText("redBright", "------------------------------------------------"))
                            continue

                        }

                            
                        
                        const evaluation  = await getAnalysis.json() as $AnalysisResponse

                        await Bun.write(`/home/dominus/Studium/Bun/Project/Security/analysis/${entity.hash}.json`, JSON.stringify(evaluation))

                        
                        if(evaluation.data.attributes.status !== 'completed') 
                            
                            continue
                        
                        



                        console.log(`{ ${entity.path} } - ` + "evaluation -> ", evaluation)


                        const state    = evaluation.data.attributes.stats.malicious >= 1 || evaluation.data.attributes.stats.suspicious >= 1? "MALICIOUS" : "SAFE"

                        console.log(`{ ${entity.path} } - ` + "state -> ", state)

                        await analysis.update.element({ evaluation, identity: entity.analysis.identity, state, status: 'PROCESSED' })

                    
                    }
                    


                }),


                unprocess: onError(async () => {
                    
                    const entitys   = await file.get.elementWithoutAnalysis({ take: 3 }) as { identity: string, hash: string, path: string, analysis: { identity: string }}[] 

                    //const analysis = Promise.all(entitys.map(async (file) => request.post.file.bind(null, await (await Archive.Element(file.path)).blob())))

                    console.log("Unprocess Evaluator.js entity -> ", entitys)
                    //console.log("analysis -> ", analysis)



                    
                    for (const entity of entitys){
                    

                        const blob     = await (await Archive.Element(entity.path)).blob()

                        console.log(`{ ${entity.path} } - ` + "blob -> ", blob)
                        
                        
                        const postFile = await request.post.file(blob) as Response


                        if(!postFile.ok || postFile.status !== 200){

                            console.log(styleText("redBright", "------------------------------------------------"))
                            console.log(`{ ${entity.path} } postFile -> `, postFile)
                            console.log(styleText("redBright", "------------------------------------------------"))
                            continue

                        }
                        
                        console.log(`{ ${entity.path} } - ` + "response -> ", postFile)

                        const target = await postFile.json() as $AnalysisResponse | { error: { message: string, code: string }}

                        
                        console.log(`{ ${entity.path} } - ` + "target -> ", target)
                        
                        if("error" in target){

                            console.log(styleText("redBright", `failed { ${entity.path} } `));

                            continue

                        }
                            

                        const getAnalysis = await request.get.file(target.data.id) as Response

                        
                        if(!getAnalysis.ok || getAnalysis.status !== 200){

                            console.log(styleText("redBright", "------------------------------------------------"))
                            console.log("`{ ${entity.path} } analysis -> ", getAnalysis)
                            console.log(styleText("redBright", "------------------------------------------------"))
                            continue

                        }

                            
                        
                        const evaluation  = await getAnalysis.json() as $AnalysisResponse

                        await Bun.write(`/home/dominus/Studium/Bun/Project/Security/analysis/${entity.hash}.json`, JSON.stringify(evaluation))

                        
                        if(evaluation.data.attributes.status === 'queued' || evaluation.data.attributes.status === 'in-progress'){

                            await analysis.update.element({ identity: entity.analysis.identity, evaluation, state: "UNDEFINED", status: 'IN_PROCESSING' })

                            continue

                        }



                        console.log(`{ ${entity.path} } - ` + "evaluation -> ", evaluation)


                        const state    = evaluation.data.attributes.stats.malicious >= 1 || evaluation.data.attributes.stats.suspicious >= 1? "MALICIOUS" : "SAFE"

                        console.log(`{ ${entity.path} } - ` + "state -> ", state)

                        await analysis.update.element({ evaluation, identity: entity.analysis.identity, state, status: 'PROCESSED' })

                    
                    }
                    


                }),



            }
        

        }
    }
}


const routine = Routine(process.env.API_KEY as string)

//await routine.update.analysis.unprocess({})
await routine.update.analysis.inprocess({})

*/