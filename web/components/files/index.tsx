import { File } from "@/lib/request"
import { List } from "./suport"

export default async function Files({ filter, classified, color }: { filter: string, classified: string, color: string }){

    const file = File()

    const request = await file.get.withQuery({ filter, classified })


    console.log(request)

    if(!request.ok || request.status !== 200)
        
        return <p className="bg-[var(--theme-scarse-error)] text-red-700 text-center border border-[var(--theme-scarse-color)] p-2 outline-0 cursor-pointer font-theme text-plentiful-text text-[8px]">Falhou</p>
    

    const files = (await request.json()).data as Array<any>

    if(!files.length)

        return <p className="bg-amber-200 text-amber-700 text-center border border-[var(--theme-scarse-color)] p-2 outline-0 cursor-pointer font-theme text-plentiful-text text-[8px]">Empty</p>


    

    /*const files = (await data.json()).data [{ name: "Aquila", size: 12, path: "C://Desktop/Memento/Aquila.pdf", type: ".pdf", hash: "fij892y98g12h3g"}, { name: "Nauta", size: 54, path: "C://Desktop/Memento/Nauta.dock", type: ".dock", hash: "09i09gj09rwegg" }]*/

    return (
        <List files={files} color={color}  />
    )

}