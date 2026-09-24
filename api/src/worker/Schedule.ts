

import * as Archive from '../Archive'
import {  Worker } from "bullmq"

import { Submit } from "../queue/Submit"
import { connection } from '../Connection'

import type { $File } from "../../T/Type"

import { Schedule } from '../queue/Schedule'
import { styleText } from 'node:util'



const MOKUP_FILES: { name: string, size: number, type: string, lastModified: string, path: string, hash: string }[] = [
    { name: "1", size: 1, type: "txt", lastModified: "1212121", path: "/limbo/1.txt", hash: "8FH26DIW92UYHDI8" },
    { name: "2", size: 2, type: "txt", lastModified: "8893281", path: "/limbo/2.txt", hash: "9DHDA63HFIUS8H2B" },
    { name: "3", size: 3, type: "txt", lastModified: "9494841", path: "/limbo/3.txt", hash: "9FJFU2UR8FHQ8284" }
]


Schedule.upsertJobScheduler('file', { every: 1000 * 60 * 1 })

const workershcedule = new Worker("Schedule", async () => {

    console.log(styleText(['yellow'], `\n{ Schedule }`))
    console.log(styleText(['yellow', 'bgYellowBright'], `\t start ${new Date().toLocaleTimeString()}`))

    const filesystem = await Archive.Collection("*.{txt,md,json,py}", "C:\\Programming\\File\\Security\\application\\test")

    /*const files: { name: string, size: number, type: string, lastModified: string, path: string, hash: string }[] = [
        { name: "1", size: 1, type: "txt", lastModified: "1212121", path: "/limbo/1.txt", hash: "8FH26DIW92UYHDI8" },
        { name: "2", size: 2, type: "txt", lastModified: "8893281", path: "/limbo/2.txt", hash: "9DHDA63HFIUS8H2B" },
        { name: "3", size: 3, type: "txt", lastModified: "9494841", path: "/limbo/3.txt", hash: "9FJFU2UR8FHQ8284" }
    ]*/
    const files = <Promise<$File>[]> await filesystem.combine('hash', 'metadata')

    

    for await(const file of files){
    
        const job = await Submit.getJob(file.hash)

        if(!job){
        
            console.log(styleText(['yellow'], `\t add to queue { Submit } the file with name { "${file.name}" }`))

            await Submit.add(file.name, file, { jobId: file.hash })

        }
  

    }
    

}, { connection, concurrency: 1})

