"use client"
import React, { useEffect, useState } from 'react';
import {useTheme} from "next-themes";

const Ring = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  const themeColor = theme === "dark" ? "#FFFFFF" : "#000000"

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="progress-container">
      <svg className={`progress-ring ${mounted ? 'animate-grow' : ''}`}  viewBox="0 0 100 100">
        <circle className="progress-ring-circle" cx="50" cy="50" r="30" stroke={themeColor} strokeWidth="5" />
      </svg>
    </div>
  );
};

export default Ring;
