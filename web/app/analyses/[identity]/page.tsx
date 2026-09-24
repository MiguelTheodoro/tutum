
import Files from "@/components/files";
import Search from "@/components/search";
import Details from "@/components/details";
import Link from "next/link";


export default async function Page({ params }: { params: Promise<{ identity: string }> }){

    const { identity } = await params

    console.log("{ Details } identity -> ", identity)


    return (
        <section className="flex flex-col gap-3 mt-10 mx-auto w-full max-w-[800px]">

            <Link href={`/files/displays/${identity}`}>
                <button className="border border-[var(--theme-scarse-color)] p-2 font-theme text-plentiful-text text-[8px]">View</button>
            </Link>

            <Details identity={identity}/>

        </section>
    )

}