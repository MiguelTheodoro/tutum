'use client';
import Link from "next/link";
import { TextSearch, Minimize2 } from "lucide-react";
import { memo, useCallback, useContext, useState, createContext, useRef, useEffect } from "react"




const Receiver = createContext(null)
const Sender   = createContext(null)


export const Interaction = ({ children }: Readonly<{ children: React.ReactNode; }>) => {

    const [ file, receive ] = useState(null)

    
    
    const emit = useCallback((newfile: any) => { 
    
        receive(newfile) 
    
    }, [])



    return (

        <Receiver.Provider value={{ file, receive }}>

            <Sender.Provider value={emit}>
                { children }
            </Sender.Provider>

        </Receiver.Provider>
    )

}



export const Information = () => {

    const { file, receive } = useContext<{ file: { abstract: object, ref: { current: HTMLElement } }, receive: (file: any) => void }>(Receiver)

    const control = useRef(null)
    
    if(!file) return;

    
    const mark = (file: any) => { 
        
        file.ref.current.style.boxShadow = "0 0 10px 2px #7da6e55e" 
        file.ref.current.style.outline = "2px solid #7db0e5"
        file.ref.current.style.outlineOffset = "2px"

    };

    const clean = (file: any) => { 

        console.log('-> ', file)

        if(!(file?.ref?.current)) return
        
        file.ref.current.style.boxShadow = "none" 
        file.ref.current.style.outline = "none"
        file.ref.current.style.outlineOffset = "none"
        
    }

    clean(control.current)

    mark(file)

    control.current = file

    return (

        <table style={{ boxShadow: "0 0 10px 1px rgb(125 166 229 / 22%)"}}>

            <tbody>

                <tr>
                    <td rowSpan="2" className="border border-[var(--theme-scarse-color)] p-2 font-theme text-plentiful-text text-[8px] text-center cursor-pointer bg-blue-200 relative h-[70px]">
                        <Link href={`/files/details/${file.abstract.identity}`} className="w-full h-full flex gap-1.5 items-center justify-center">
                            <TextSearch size={12}/> Details
                        </Link>
                    </td>

                    { Object.keys(file.abstract).map((key, index) => (
                        
                        <td key={index} className="border-b border-t border-x border-[var(--theme-scarse-color)] p-2 font-theme text-plentiful-text text-[8px]">{ key }</td>
                        
                    ))}
                    <td rowSpan="2" className="border border-[var(--theme-scarse-color)] p-2 font-theme text-plentiful-text text-[8px] text-center cursor-pointer bg-red-200" onClick={() => { 
                    
                        clean(control.current)
                        receive(null)

                    }}><Minimize2 size={12}/></td>
                </tr>
                <tr>
                    { Object.values(file.abstract).map((value, index, self) => (

                        <td key={index} className={`border-b ${self.length - 1 == index ? 'border-r' : ''} border-[var(--theme-scarse-color)] p-2 break-all font-theme text-plentiful-text text-[8px]`}>{ value }</td>

                    ))}
                </tr>

            </tbody>
            
            

        </table>

    )

}




export const File = memo(({ file, color }: { file: { name: string}, color: string  }) => {

    const ref  = useRef(null)
    

    const emit = useContext(Sender)

    const unlink = useEffect(() => {

        return () => emit(null)

    }, [])

    return (

        <div ref={ref} className={`flex flex-col justify-end border border-[var(--theme-scarse-color)] p-2 w-[200px] h-[200px] cursor-pointer`} onClick={() => emit({ abstract: file, ref })} style={{ backgroundColor: `var(${color})` }}>

            <p className="font-theme text-plentiful-text text-[8px]">{ file.name }</p>

        </div>

    )

})


export const List = ({ files, color }: { files: Array<object>, color: string }) => {

    return (

        <ul className="flex flex-wrap gap-3">

            { files.map((file, index) => (
                <li key={ file.hash }>
                    <File key={index} file={file} color={color} />
                </li>
            ))}

        </ul>

    )

}
