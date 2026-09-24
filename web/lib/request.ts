import { Build } from "@/lib/External"
import { onError } from "@/lib/Error"


export const File = () => {

    const onRequest = Build.Request("http://localhost:5000/")

    return {

        get: {
            
            classified: onError(onRequest(async (state: 'safe' | 'malicius' | 'undefined') => {

                return { query: { reliability: state } }

            }, { endpoint: "files", method: "GET" })),  
            
            withQuery: onError(onRequest(async (query: Record<string, string>) => {

                return { query: query }

            }, { endpoint: "files", method: "GET" })),

            element: onError(onRequest(async (identity: string) => {

                return { param: identity }

            }, { endpoint: "files", method: "GET" })),

            blob: onError(onRequest(async (identity: string) => {

                return { param: identity }

            }, { endpoint: "files/blob", method: "GET" }))

        }

    }

}