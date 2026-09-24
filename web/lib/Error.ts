

export const onError = <Type>(callback: (data: Type) => Promise<any>) => {

    return async (data: Type) => { 
    
        try {

            const result = await callback(data)

            return result

        }

        catch(error){

            return error

        }
        
    }
}