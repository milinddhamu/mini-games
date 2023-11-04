import TicTacToeGame from "./TicTacToeGame"

export default function Home() {

  return (
    <>
      <div className="flex flex-col justify-start items-center h-screen">
        <h1 className="font-black px-4 uppercase text-center text-3xl md:text-5xl lg:text-6xl xl:text-7xl -mt-1 md:-mt-2 lg:-mt-3 xl:-mt-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-white">Tic Tac Toe</h1>
        <TicTacToeGame />

      </div>
    </>
  )
}