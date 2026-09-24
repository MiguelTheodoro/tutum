import { styleText } from 'node:util';

import { PrismaClient } from "../../generated/prisma"
import { $AnalysisResponse, Analysis } from "../Evaluator"
import * as Database from "../Database"
import * as Archive from '../Archive'
import { Job, WaitingError, Worker } from "bullmq"
import { sleep } from 'bun'

import { Check } from "../queue/Check"
import { connection } from "../Connection"
import { EOF } from 'node:dns';


const checkworker = new Worker("Check", async (job: Job, token) => {

    console.log(styleText(['green'], `\n{ Check }`))
    
    console.log(styleText(['green', 'bgGreenBright'], `\t start ${new Date().toLocaleTimeString()}`))
    
    try {


        const file = await Archive.Element(job.data.path)

        const filedatabase = await Database.File(new PrismaClient)

        const evaluator = Analysis(process.env.API_KEY as string)

        const feedback  = await evaluator.get.file(job.data.analysis.identity) as Response

        console.log(styleText(['green'], `\t fecth api`))

        if(!feedback.ok || feedback.status != 200) throw new Error("")

        const analysis = await feedback.json() as $AnalysisResponse | { error: { message: string, code: string }}

        console.log(styleText(['green'], `\t extract analysis from request`))

        if("error" in analysis || analysis.data.attributes.status !== "completed") {
            
            await Bun.write(`C:\\Programming\\File\\Security\\application\\analysis\\pre-check\\${job.data.name}.json`, JSON.stringify(analysis, null, 2))
            console.log(styleText(['red'], `\t failed because ${"error" in analysis ? 'error in analysis' : "isn't completed"}`))
            throw new Error("")

        }


        
        
        const state = analysis.data.attributes.stats.malicious >= 1 || analysis.data.attributes.stats.suspicious >= 1 ? "MALICIOUS" : "SAFE"


        
        const { analysis: rest, ...fileattribute} = job.data

        console.log(styleText(['green'], `\t file attributes ${JSON.stringify(fileattribute)}`))

        console.log(styleText(['green'], `\t analysis ${JSON.stringify(analysis)}`))

        
        
        await Bun.write(`C:\\Programming\\File\\Security\\application\\analysis\\check\\${job.data.name}.json`, JSON.stringify(analysis))
        
        console.log(styleText(['green'], `\t save analysis in "C:\\Programming\\File\\Security\\application\\analysis\\check" directory with name { "${job.data.name}" }`))


        const destiny = state === "SAFE" ? process.env.SAFE_DIRECTORY : process.env.UNSAFE_DIRECTORY

        const path = await file.move(destiny as string)

        console.log(styleText(['green'], `\t move to "${destiny}" directory`))

        await filedatabase.add.elementWithAnalysis({ file:  { ...fileattribute, path },  analysis: { evaluation: analysis, state, status: 'PROCESSED' } })

        console.log(styleText(['green'], `\t save analysis in database`))
        

    }catch(error){

        console.log(styleText(['red', 'bgRedBright'], `\t ${new Date().toLocaleTimeString()} retry to queue the { "${job.name}" } task for the [ ${job.attemptsStarted} ] time`))

        await sleep(1000 * 60 * 3.5)

        await job.changePriority({ priority: job.attemptsStarted + 1})

        await job.moveToWait(token)

        throw new WaitingError();

    }

    console.log(styleText(['yellow', 'bgGreen'], `\t sleep ${new Date().toLocaleTimeString()}`))
    await sleep(1000 * 60 * 3.5)

}, { connection, concurrency: 1 })