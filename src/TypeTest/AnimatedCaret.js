"use client"
import {useTheme} from "next-themes";
import {Tooltip} from "@nextui-org/react";
export default function AnimatedCaret({isOpponent,isOnline,name}){
  const { theme, setTheme } = useTheme()
  return (
    <Tooltip
        isOpen={isOnline || false}
        content={name}
        color={isOpponent !== undefined ? (isOpponent ? "danger" : "primary") : "default"  }
      >
    <div className="relative h-5 sm:h-7 mt-[1px] w-1">
      <div className={`border border-x-1 ${isOpponent === undefined ? (theme === "light" ? "border-black" : "border-white") : isOpponent ? "border-red-500" : "border-blue-500"} animate-cursor-shrink-grow absolute h-full`}></div>
    </div>
      </Tooltip>
  );
};

