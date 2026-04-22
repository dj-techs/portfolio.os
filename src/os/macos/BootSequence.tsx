"use client";

import { motion } from "framer-motion";
import { AppleLogo } from "@/shared/AppleLogo";

export default function BootSequence({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        // total ~1.8s
        setTimeout(onDone, 1800);
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white"
      >
        <AppleLogo className="h-24 w-24" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 h-[3px] w-56 overflow-hidden rounded-full bg-white/10"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="h-full bg-white/80"
        />
      </motion.div>
    </motion.div>
  );
}
