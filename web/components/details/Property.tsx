import Link from "next/link"
import { SquareArrowOutUpRight } from "lucide-react"

export const Property = ({ data }: { data: object }) => {

    return (
        <ul className="flex flex-row flex-wrap gap-2">
            {
                Object.entries(data).map(([ key, value ]) => (
                    
                    <li key={key} className="border border-[var(--theme-scarse-color)]  p-2 min-w-auto h-[100px] flex flex-col justify-between grow">

                        { typeof value === "object" && 

                            <Link href={`http://localhost:5000/analyses/evaluation/${data.identity}`} target="_blank">


                                <span className="block p-2 font-theme text-blue-500 text-[8px] cursor-pointer ">
                                    <SquareArrowOutUpRight size={12}/>
                                </span>
                            </Link>

                            ||
                            <span className="border-b font-bold border-[var(--theme-scarse-color)] bg-[var(--theme-scarse-color)] block p-2 font-theme text-[var(--theme-plentiful-color)] text-[8px] ">{ value }</span>
                        
                        }
                        
                        <span className="p-2 font-theme text-plentiful-text text-[8px] text-end ">{ key }</span>

                    </li>

                ))
            }
            
        </ul>
    )

}