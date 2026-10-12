"use client";

import Image from "next/image";
import { motion } from "motion/react";

export const Logo = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 lg:top-6"
  >
    <Image
      src="/logo.png"
      alt="ValoCards"
      width={38}
      height={46}
      className="animate-pulse drop-shadow-red"
      priority
    />
  </motion.div>
);
