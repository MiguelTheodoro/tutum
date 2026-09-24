
import { spawn } from 'bun'


console.clear()
const scripts = ["./src/queue/Check.ts", "./src/queue/Submit.ts", "./src/queue/Schedule.ts", "./src/worker/Schedule.ts", "./src/worker/Submit.ts", "./src/worker/Check.ts"];

for (const script of scripts) {
  spawn(["bun", "run", script], {
    stdout: "inherit", 
    stderr: "inherit", 
  });
}

console.log("🚀 Todos os algoritmos foram iniciados em background!");