import { file } from 'bun'
import { PrismaClient } from '../generated/prisma'
import * as Archive from './Archive'
import * as Memento from './Database'


const hashSetFromMultipleSystem = Symbol('hashSetFromMultipleSystem')


export const Observer = async (filepattern: string, fileorigin: string) => {

    const client   = new PrismaClient

    const file     = Memento.File(client) 

    const analysis = Memento.Analysis(client)

    const files    = await Archive.Collection(filepattern, fileorigin)

    return {

        files,
        

        database: {

            file, 

            analysis

        },

        differance: {

            async [hashSetFromMultipleSystem](){
                
            
    
                const hashFromFileSystem = new Set((await Promise.all(await files.hash())).map((element: { hash: string }) => element.hash))
                
                const hashFromDatabase   = new Set((await file.get.hash({})).map((element: { hash: string }) => element.hash))

                return { filesystem: hashFromFileSystem, database: hashFromDatabase }

            },

            async filesystem(){

                const set = await this[hashSetFromMultipleSystem]()

                return set.filesystem.difference(set.database)


            },

            async database(){

                const set = await this[hashSetFromMultipleSystem]()

                return set.database.difference(set.filesystem)

            }
        }

    }
}


export const Update = async (filepattern: string, fileorigin: string) => {

    const observer = await Observer(filepattern, fileorigin)


    return {

        observer,

        reflect: {
        
            async filesystem(){

                const onlyFilesystem = await observer.differance.filesystem()

                const add    = (await observer.files.filter(async (file) => onlyFilesystem.has((await file.hash()).hash))).map(async (file) => file.combine('hash', 'metadata') )
               
                console.log('onlyFilesystem -> ', onlyFilesystem)

                console.log('add -> ',   await Promise.all<Promise<Memento.$File>[]>(add as Promise<Memento.$File>[]))
                
                await observer.database.file.add.element(await Promise.all<Promise<Memento.$File>[]>(add as Promise<Memento.$File>[]))
              
            },

            async database(){

                const onlyDatabase = await observer.differance.database()

        
                //const remove = (await observer.files.filter(async (file) => onlyDatabase.has((await file.hash()).hash))).map(async (file) => file.combine('hash', 'metadata') )
    
                console.log('onlyDatabase   -> ', onlyDatabase)

                console.log('remove -> ', [...onlyDatabase])

                await observer.database.file.remove.elementWithHash([...onlyDatabase] as string[])


            }
        }

    }

}


