"use client";

import { Google } from "@/components/auth/Google";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  px-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="
          relative  max-w-sm
          rounded-2xl border border-white/10 
          shadow-2xl
          md:max-w-xl backdrop-blur-sm
        "
      >
        {/* Close Button */}
        <Button
          onClick={() => {router.back() } }
          className={`absolute right-4 bg-transparent hover:bg-transparent top-4 text-white/70 dela hover:text-white transition 
                      `}
        >
          ✕
        </Button>

        {/* Content */}
        <div className="flex flex-col gap-3 px-6 py-7 md:px-8 md:py-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white">
              Sign in
            </h2>
            <p className="text-sm text-white/50 leading-relaxed">
              One step closer to getting leads and growing your business.
            </p>
          </div>

          {/* Google Button */}
          <div className="flex justify-center pt-2">
            <div  className=" origin-center">
              <Google />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
