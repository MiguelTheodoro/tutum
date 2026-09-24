
import Files from "@/components/files";
import Search from "@/components/search";
import Details from "@/components/details";
import Link from "next/link";
import { Eye } from "lucide-react";
import { MemoBack } from "@/components/back";
import { Vizualizer, See } from "@/components/display";
import Display from "@/components/display";




export default async function Page({ params }: { params: Promise<{ identity: string }> }){

    const { identity } = await params

    console.log("{ Details } identity -> ", identity)


    return (
        <section className="flex flex-col gap-3 my-10 mx-auto w-full max-w-[800px]">

            <Vizualizer>

                <header className="flex flex-row gap-2">

                    <MemoBack/>
                
                    <See/>

                </header>

                <Display identity={identity} />

            </Vizualizer>
                


            <Details identity={identity}/>

        </section>
    )

}