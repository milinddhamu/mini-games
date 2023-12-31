"use client"
import {useTheme} from "next-themes";

export default function AnimatedCaret({isOpponent}){
  const { theme, setTheme } = useTheme()
  return (
    <div className="relative h-8 w-1">
      <div className={`border border-x-1 ${isOpponent ? "border-red-500" : "border-blue-500"} animate-cursor-shrink-grow absolute h-full`}></div>
    </div>
  );
};

