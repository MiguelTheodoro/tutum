'use client';

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search as SearchIcon }from "lucide-react";

export default function Search(){

    const searchParams = useSearchParams()

    const pathname = usePathname()

    const { replace } = useRouter()


    const handle = useDebouncedCallback((value: string) => {

        const params = new URLSearchParams(searchParams)

        if(value) params.set("filter", value)

        else params.delete("filter")

        replace(`${pathname}?${params.toString()}`)

    }, 300)


    return (

        <div className="w-full flex flex-row relative">

            <input type="text" className="w-full border border-[var(--theme-scarse-color)]  p-2 pr-[30px] outline-0 cursor-pointer font-theme text-plentiful-text text-[8px]" onChange={(event) => handle(event.target.value)} defaultValue={searchParams.get('filter')?.toString()}/>

            <span className="absolute right-[10px] top-1/2 translate-y-[-50%]">
                <SearchIcon size={12} />
            </span>

        </div>
        
    )

}