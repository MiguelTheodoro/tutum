import { file, Glob } from 'bun'
import path from 'node:path'
import fs from 'node:fs'
import { rename } from 'node:fs/promises'







type $Scan = Extract<Parameters<Glob['scan']>[number], { cwd?: string }> & { cwd: string }

export const List = (pattern: string) => async (argument: string | $Scan) => {

    const origin = typeof argument == 'string' ? argument : argument.cwd
    
    if(!fs.existsSync(origin)) return []

    const glob = new Glob(pattern)

    const files = await Array.fromAsync(glob.scan(argument))

    return files

}


interface $Archive { file: Bun.BunFile,  hash(): Promise<{ hash: string }>, blob(): Promise<Blob>,  metadata(): { name: string, size: number, type: string, lastModified: string, path: string }, combine(...propertys:( keyof Omit<$Archive, 'file' | 'combine'>)[]): Promise<unknown>, move(destiny: string): Promise<string | false> }

export const Element =  async (filepath: string): Promise<$Archive> => {

    const file = await Bun.file(filepath)
    
    if(!file.size)

        throw new Error(`The file in { ${filepath} } directory not exist or is empty`)

    return {

        file,

        async hash(){

            const hash   = new Bun.CryptoHasher('sha256')

            const stream = await this.file.stream()

            for await(const chuck of stream) hash.update(chuck)

            return { hash: hash.digest('hex') }
            
        },

        metadata(){
            
            return { name: path.basename(this.file.name ?? '', path.extname(this.file.name ?? '')), size: this.file.size, type: this.file.type, lastModified: new Date(this.file.lastModified).toISOString(), path: path.resolve(this.file.name ?? '') }

        },

        async blob(){

            return await this.file.stream().blob()

        },

        async combine<Return>(...propertys:( keyof Omit<$Archive, 'file' | 'combine'>)[]): Promise<Return> {
            
            let combine = {}

            for (const property of propertys) Object.assign(combine, await this[property]())
            
            return combine as unknown as Promise<Return>        
    
        },

        async move(destiny: string){

            const { name, path: origin } = await this.metadata()

            const destinypath = path.normalize(destiny + path.sep + path.basename(this.file.name as string))

            try {

                await rename(origin, destinypath)

                return destinypath

            }catch(eror){

                return false

            }


        }

    } satisfies $Archive
}


export const Collection = async (filepattern: string, fileorigin: string) => {

    const filepaths = (await List(filepattern))({ cwd: fileorigin, absolute: true })

    if(!(await filepaths).length) 
        
        throw new Error()

    return {

        filepaths,

        files: (await filepaths).map(async (filename: string) => await Element(filename)),

        async hash(){

            return await this.files.map(async (file) => await (await file).hash())

        },

        async metadata(){

            return await this.files.map(async (file) => await (await file).metadata())

        },

        async combine<Return>(...propertys:( keyof Omit<$Archive, 'file'>)[]): Promise<Promise<Return>[]> {

            return await this.files.map(async (file) => {

                let combine = {}
                
                for (const property of propertys) Object.assign(combine, await (await file)[property]())

                return combine

            }) as unknown as Promise<Promise<Return>[]>        

        },

        async filter(callback: (file: $Archive) => Promise<boolean>){

            const files: $Archive[] = []

            for await(const file of this.files) if(await callback(file)) files.push(file)

            return files

        }

    }
    

}

type x =  (keyof Omit<$Archive, 'file'>)[]

