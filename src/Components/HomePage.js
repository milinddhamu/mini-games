
import {useTheme} from "next-themes";
import { ThemeSwitcher } from "./ThemeSwitcher";
import TicTacToeCard from "@/TicTacToe/TicTacToeCard";

const HomePage = () => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-start items-center flex-col w-full h-screen gap-6">
      <h1 className={`font-black px-4 uppercase text-center text-5xl md:text-6xl lg:text-8xl xl:text-9xl -mt-2 md:-mt-3 lg:-mt-6 xl:-mt-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${theme === "dark" ? "from-black to-white" : "from-white to-zinc-800"}`}>Browse Games</h1>

      <TicTacToeCard />
      <h1>More games coming soon!</h1>
    </div>
  );
}

export default HomePage;