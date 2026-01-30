'use client'

import { useEffect, useRef } from "react";
import { useState } from 'react';
import { motion, cubicBezier } from "framer-motion";
import { ChevronDown } from 'lucide-react';



export function Header() {

  return (
    <Navbar></Navbar>
  );
}


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
const lastScrollY = useRef(0);

  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY.current;

    // scroll down
    if (diff > 10) {
      setScrolled(true);
    }

    // scroll up
    if (diff < -10) {
      setScrolled(false);
    }

    lastScrollY.current = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const ease = cubicBezier(0.22, 1, 0.36, 1);


  return (
    <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* Width + position animation */}
      <motion.div
        animate={{
          maxWidth: scrolled ? 640 : 1024,
        }}
        transition={{ duration: 0.45, ease }}
        className="mx-auto mt-6 pointer-events-auto px-2"
      >
        {/* Navbar capsule */}
        <motion.nav
          animate={{
            borderRadius: scrolled ? 999 : 20,
            backgroundColor: scrolled
              ? "rgba(0,0,0,0.6)"
              : "rgba(0,0,0,0.4)",
            backdropFilter: scrolled
              ? "blur(24px)"
              : "blur(12px)",
          }}
          transition={{ duration: 0.70, ease }}
          className="
            flex items-center justify-between
            border border-white/10
            px-4 py-6
          "
        >
          {/* LEFT */}
          <div className="flex items-center font-semibold overflow-hidden">
            {/* Logo */}
            <div className="h-8 w-8 rounded-full bg-red-800 shrink-0 mr-2" />

            {/* Text (collapses smoothly) */}
            <motion.span
              animate={{
                opacity: scrolled ? 0 : 1,
                maxWidth: scrolled ? 0 : 140,
                marginRight: scrolled ? 0 : 12,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="text-white whitespace-nowrap overflow-hidden font-bold text-xl"
            >
              Scrappex
            </motion.span>
          </div>


          {/* CENTER */}
          <div className={`hidden md:flex gap-6 text-white text-md mx-auto ${!scrolled &&'ml-10'}`}>
            <span className=" transition flex gap-1">Features <ChevronDown className="text-white/45 mt-1" size={'18'}/></span> 
            <span className=" transition flex gap-1">Developer <ChevronDown className="text-white/45 mt-1" size={'18'} /></span>
            <span className=" transition flex gap-1">Resources <ChevronDown className="text-white/45 mt-1" size={'18'}/></span>
            <span className=" transition flex gap-1">Pricing <ChevronDown className="text-white/45 mt-1" size={'18'}/></span>
          </div>

          {/* RIGHT */}
          <motion.button
            animate={{
              borderRadius: scrolled ? 999 : 10,
            }}
            transition={{ duration: 0.35, ease }}
            className="
              bg-white/10 text-white
              px-4 py-2 text-sm
              hover:bg-white/20 transition
            "
          >
            Login
          </motion.button>
        </motion.nav>
      </motion.div>
    </div>
  );
}
