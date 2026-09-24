import { Interaction, Information } from "@/components/files/suport";
import Files from "@/components/files";
import Search from "@/components/search";




export default async function Page(props: { searchParams?: Promise<{ filter?: string; page?: string; }>; }){

    const searchParams = await props.searchParams

    const filter = searchParams?.filter || ''



    return (
        <section className="flex flex-col gap-3 mt-10 mx-auto w-full max-w-[800px]">

            <Search/>

            <Interaction>

                <Information/>

                <Files filter={filter} classified="malicius" color="--theme-scarse-error"/>

            </Interaction>

        </section>
    )

}