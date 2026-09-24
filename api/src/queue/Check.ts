import { connection } from "../Connection"
import { Queue } from "bullmq"

export const Check  = new Queue("Check", { connection, defaultJobOptions: { removeOnComplete: true, removeOnFail: true }})