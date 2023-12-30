"use client"
import {useTheme} from "next-themes";

import TestBase from "@/TypeTest/TestBase";
export default function Home(){
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col h-screen -mt-20 pt-20 w-full">
      <h1 className={`font-black px-4 uppercase text-center text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${theme === "dark" ? "from-white to-black" : "from-black to-white"} opacity-50`}>Type Test</h1>
    <TestBase />
    </div>  
  );
};