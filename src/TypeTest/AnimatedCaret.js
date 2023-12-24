const AnimatedCaret = () => {
  return (
    <div className="relative h-8 sm:h-10 w-1">
      <div className="border border-x-1 border-white animate-cursor-shrink-grow absolute h-full"></div>
    </div>
  );
};

export default AnimatedCaret;
