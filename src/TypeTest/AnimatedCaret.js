"use client"
import {useTheme} from "next-themes";

export default function AnimatedCaret(){
  const { theme, setTheme } = useTheme()
  return (
    <div className="relative h-5 sm:h-7 mt-[1px] w-1">
      <div className={`border border-x-1 ${theme === "light" ? "border-black" : "border-white"} animate-cursor-shrink-grow absolute h-full`}></div>
    </div>
  );
};

