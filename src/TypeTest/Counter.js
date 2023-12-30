"use client"

import {useRef,useEffect} from "react";
import { animate } from "framer-motion";

export default function Counter({ from, to }) {
  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        node.textContent = value.toFixed();
      }
    });

    return () => controls.stop();
  }, []);

  return <p className="font-black text-9xl"
    ref={nodeRef} />;
};