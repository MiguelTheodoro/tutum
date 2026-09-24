
const c = new Error()
export const onError = <Type>(callback: (data: Type) => Promise<any>, options?: any | ((error: unknown) => any) | Error | string) => {

    return async (data: Type) => { 
    
        try {

            const result = await callback(data)

            return result

        }

        catch(error){

            if(typeof options === "string" || typeof options === "object")

                return options

            if(typeof options === "function")

                return await options(error)

            return error
            

        }
        
    }
}