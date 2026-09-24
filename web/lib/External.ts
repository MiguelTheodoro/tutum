import type { BodyInit } from "bun";


type $Config = Partial<{ endpoint: string, method: 'GET' | 'POST' }>

type $RequestContent = { body: object } | { query: Record<string, string | readonly string[]> | string } | { param: string } | undefined


export const Build = {
        
    Request: (requestInfo: string, init?: RequestInit) => 

        <Callback extends (...params: any[]) => Promise<$RequestContent>> (callback: Callback, config: $Config = {}) => 
            
            async (...subparams: Parameters<Callback>): Promise<Response> => {

                
                const destiny = new URL(`${requestInfo}${(requestInfo.endsWith('/') ? '' : '/') + config.endpoint?.replaceAll('/', '')}`)

                const content = await callback(...subparams)

                const request: BunFetchRequestInit = { method: config.method ?? 'GET', ...(init ?? {})  }


                if(!content)
                    
                    return await fetch(destiny)

                    
                    
                if("query" in content) destiny.search   = new URLSearchParams(content.query).toString()

                if("param" in content) destiny.pathname += `/${content.param}`

                if("body" in content) request.body = content.body as BodyInit
                
                console.log("destiny -> ", destiny.toString())
                console.log("request -> ", request)

                return await fetch(destiny, request)

            }
            
        
}





