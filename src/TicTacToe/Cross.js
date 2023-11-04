"use client"
import React, { useEffect, useState } from 'react';
import "./Cross.css";
import {useTheme} from "next-themes";

const Cross = () => {
  const { theme } = useTheme();

  const themeColor = theme ==="dark" ? "#FFFFFF" : "#000000"

  return (
    <>
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xmlSpace="preserve">

        <g id="Layer_3">
          <line id="path2" fill="none" stroke={themeColor} stroke-width="5" stroke-miterlimit="10" x1="8.5" y1="41.5" x2="41.5" y2="8.5" />
          <line id="path3" fill="none" stroke={themeColor} stroke-width="5" stroke-miterlimit="10" x1="41.5" y1="41.5" x2="8.5" y2="8.5" />
        </g>
      </svg>

    </>
  );
};

export default Cross;

