"use client"

import TestBase from "@/TypeTest/TestBase";
export default function Home(){
  return (
    <div className="flex flex-col h-screen -mt-20 pt-20 w-full">
      <h1 className="font-black px-4 uppercase text-center text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-white opacity-50">Type Test</h1>
    <TestBase />
    </div>  
  );
};