import { File } from "@/lib/request"
import  Link  from "next/link"
import { Property } from "./Property"

type $File = { identity: string, name: string, type: string, size: number, lastModified: number, hash: string, analysis: { status: string, evaluate: object,  state: string } }

export default async function Details({ identity }: { identity: string }){

    const filerequest = File()

    const response = await filerequest.get.element(identity)

    const file = await response.json()

    const { analysis, ...attributes } = file.data


    return (
       

        <section className="flex flex-col gap-5">
            <section >
                <h2 className="border border-[var(--theme-scarse-color)]  p-2 font-theme text-plentiful-text text-[8px] mb-3">Attribute</h2>

                <Property data={attributes} />
                
            </section>
            <section >
                <h2 className="border border-[var(--theme-scarse-color)]  p-2 font-theme text-plentiful-text text-[8px] mb-3">Analysis</h2>
                <Property data={analysis} />
            </section>
       </section>
    )

}