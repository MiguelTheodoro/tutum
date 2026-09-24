
import { PrismaClient } from "../../generated/prisma"
import { $AnalysisResponse, Analysis } from "../Evaluator"
import * as Database from "../Database"
import * as Archive from '../Archive'
import { Job, WaitingError, Worker } from "bullmq"
import { sleep } from 'bun'
import { Check } from "../queue/Check"
import { Submit } from "../queue/Submit"
import { connection } from "../Connection"
import { styleText } from "node:util"






const submitworker = new Worker("Submit", async (job: Job, token) => {

    console.log(styleText(['blue'], `\n{ Submit }`))
    console.log(styleText(['blue', 'bgBlueBright'], `\t start ${new Date().toLocaleTimeString()}`))
    console.log(styleText(['blue'], `\t process the { "${job.data.name}" } job`))
    //console.log("in { Submit } process task -> " + JSON.stringify(job, null, 2))

    try {
        
        const file = await Archive.Element(job.data.path)

        const evaluator = Analysis(process.env.API_KEY as string)

        const feedback  = await evaluator.post.file(await file.blob()) as Response

        console.log(styleText(['blue'], `\t fecth api`))

        if(!feedback.ok || feedback.status != 200) throw new Error("")

        const analysis = await feedback.json() as $AnalysisResponse | { error: { message: string, code: string }}

        console.log(styleText(['blue'], `\t extract analysis from request`))

        if("error" in analysis) { 
            
            console.log(styleText(['red'], `\t failed because error in analysis`))
            throw new Error("")


        }


        await Bun.write(`C:\\Programming\\File\\Security\\application\\analysis\\submit\\${job.data.name}.json`, JSON.stringify(analysis))

        console.log(styleText(['blue'], `\t save analysis in "C:\\Programming\\File\\Security\\application\\analysis\\check" directory with name { "${job.data.name}" }`))
            
        const path = await file.move(process.env.EVALUATE_DIRECTORY as string)

        console.log(styleText(['blue'], `\t move to "${process.env.EVALUATE_DIRECTORY}" directory`))

        
            

        await Check.add(job.name, { ...job.data, path, analysis: { identity: analysis.data.id } }, { jobId: job.data.hash, removeOnComplete: true, removeOnFail: true  })
        //await Check.add(job.name, { ...job.data, analysis: { identity: 1 } }, { jobId: job.data.path, removeOnComplete: true, removeOnFail: true  })


    }catch(error){

        console.log(styleText(['red', 'bgRedBright'], `\t ${new Date().toLocaleTimeString()} retry to queue the { "${job.name}" } task for the [ ${job.attemptsStarted} ] time`))

        await sleep(1000 * 60 * 3)    
            
        await job.changePriority({ priority: job.attemptsStarted + 1})

        await job.moveToWait(token)

        throw new WaitingError();
        
    }

    console.log(styleText(['yellow', 'bgGreen'], `\t sleep ${new Date().toLocaleTimeString()}`))
    await sleep(1000 * 60 * 3)

    //Summary.add(job.name, { ...attribute, analysis: { identity } }, { jobId: task.hash })

}, { connection, concurrency: 1 })

