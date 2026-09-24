'use client';
import { useRouter } from "next/navigation";
import { memo } from "react";
import { MoveLeft } from "lucide-react";




export default function Back(){

    const router = useRouter()  
    
    return (

        <button className="w-8 h-8  border border-[var(--theme-scarse-color)] p-2 font-theme text-plentiful-text text-[8px] cursor-pointer" onClick={() => router.back()}>
            <MoveLeft size={12}/>
        </button>     

    )

}

export const MemoBack = memo(Back)