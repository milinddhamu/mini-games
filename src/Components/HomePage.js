
import {useTheme} from "next-themes";
import { ThemeSwitcher } from "./ThemeSwitcher";
import TicTacToeCard from "@/TicTacToe/TicTacToeCard";
import TypeTestCard from "@/TypeTest/TypeTestCard";

const HomePage = () => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-between items-center flex-col w-full h-screen gap-6">
      <h1 className={`font-black px-4 uppercase text-center text-5xl md:text-6xl lg:text-8xl xl:text-9xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${theme === "light" ? "from-black to-white" : "from-white to-black"} opacity-60`}>Browse Games</h1>
      <div className="flex flexsm:flex-row w-full justify-center items-start gap-4 px-6 h-full">
      <TicTacToeCard />
      <TypeTestCard />
      </div>
      <h1>More games coming soon!</h1>
    </div>
  );
}

export default HomePage;