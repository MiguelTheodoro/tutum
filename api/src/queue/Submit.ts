import { connection } from "../Connection"
import { Queue } from "bullmq"

export const Submit = new Queue("Submit", { connection, defaultJobOptions: { } })