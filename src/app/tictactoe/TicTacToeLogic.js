export const initialBoard = Object.freeze([
  { position: 0, value: '' },
  { position: 1, value: '' },
  { position: 2, value: '' },
  { position: 3, value: '' },
  { position: 4, value: '' },
  { position: 5, value: '' },
  { position: 6, value: '' },
  { position: 7, value: '' },
  { position: 8, value: '' },
]);

export const calculateWinner = (board) => {
  const markedCount = board.filter((cell) => cell.value !== '').length;
  if (markedCount < 3) {
    return null;
  }

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a].value && board[a].value === board[b].value && board[a].value === board[c].value) {
      return board[a].value;
    }
  }

  return null;
};

export const isDraw = (board) => {
  if (!calculateWinner(board) && board.every((cell) => cell.value !== '')) {
    return true;
  }
  return false;
};


export const boardDesign = {
  flex: 'flex flex-col p-4 mt-8 items-center w-full gap-4',
  statusContainer: 'flex flex-row justify-between items-center w-full max-w-lg px-6 gap-4',
  statusText: 'font-semibold text-2xl',
  gridContainer: 'grid grid-cols-3 grid-rows-3 grid-flow-row gap-2 max-w-lg w-full',
  cellButton: 'flex justify-center items-center w-full aspect-square rounded-xl border border-gray-500/50 hover:bg-white/10 transition-all ease-linear duration-300',
};