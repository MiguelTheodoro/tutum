'use client';

import Image from "next/image";
import { createContext, useContext, useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { File } from "@/lib/request";
const Context = createContext<any>('')

export const Vizualizer = ({ children }: Readonly<{ children: React.ReactNode; }>) => {

  const [ visible, set ]  = useState<boolean>(false)

  const toggle = () => set(!visible)

  return (
    <Context.Provider value={{ visible, toggle }}>
      { children }
    </Context.Provider>
  )
}


export const See = () => {

  const { visible, toggle } = useContext<{ visible: boolean, toggle: () => void }>(Context)


  return (
    <span className="w-8 h-8 border border-[var(--theme-scarse-color)] font-theme text-plentiful-text cursor-pointer flex flex-col items-center justify-center-safe" onClick={() => toggle()}>
        { visible && <Eye size={12} color={"#18181b"}/> || <EyeClosed size={12} color={"#18181b"}/> }
    </span>
  )
  
}




export default function Display({ identity }: { identity: string }){

  const { visible } = useContext<{ visible: boolean, toggle: () => void }>(Context)

  const [ file, set ] = useState()


  useEffect(() => {

    (async () => {

      const filerequest = File()
    
      const response = await filerequest.get.element(identity)
    
      const json = await response.json()

      console.log("json from request: ", json)

      set(json)

    })()

  }, [])
  

  if(!visible)

    return;



  

  const url = `http://localhost:5000/files/blob/${identity}`

    
  console.log("file -> ", file)
  const extension = String(file.data.path).split('.')[1] || ''

  console.log("extension -> ", extension)

  // 1. Images
  if (["jpg", "jpeg", "png", "webp", "svg"].includes(extension || "")) {
    return (
      <div className="relative w-full h-96">
        <Image src={url} alt="Preview" fill className="object-contain" />
      </div>
    );
  }

  // 2. Videos
  if (["mp4", "webm", "ogg"].includes(extension || "")) {
    return <video src={url} controls className="w-full max-h-96" />;
  }

  // 3. Audio
  if (["mp3", "wav"].includes(extension || "")) {
    return <audio src={url} controls className="w-full p-4" />;
  }

  // 4. PDFs and Code/Text Files (via Browser Sandbox)
  if (["pdf", "txt", "json", "md"].includes(extension || "")) {
    return <iframe src={url} className="w-full h-[600px]  border border-[var(--theme-scarse-color)] "  />;
  }

  // Fallback download button for unsupported files
  return <p className="bg-[var(--theme-scarse-error)] text-red-700 text-center border border-[var(--theme-scarse-color)] p-2 outline-0 cursor-pointer font-theme text-plentiful-text text-[8px]">The file with .{extension} type cannot be previwed inline</p>
  

}