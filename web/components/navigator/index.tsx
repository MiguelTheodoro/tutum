import Link from "next/link"
import styles from "./stye.module.css"

type $Destiny = { 
    background: string,
    link: string,
}

const destiny = [
    {
        background: "green",
        link: "/files/safe",
    },
    {
        background: "red",
        link: "/files/unsafe",
    },
    {
        background: "green",
        link: "/files/unclassified",
    }
]

export default function Navigator(){

    return (

        <header className="border border-2 p-1">
            <nav>
                <ul className="flex flex-col gap-2">
                    {
                        destiny.map(({ background, link }, index) => (

                            <li key={index} className={`w-[50px] h-[50px] bg-background-[${background}]`}>
                                <Link href={link}/>
                            </li>

                        ))                       
                    }
                </ul>
            </nav>
        </header>

    )

}