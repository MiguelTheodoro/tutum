import { connection } from "../Connection"
import { Queue } from "bullmq"

export const Schedule  = new Queue("Schedule", { connection, defaultJobOptions: { removeOnComplete: true, removeOnFail: true } })