"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(80vh-4rem)] flex flex-col-reverse md:flex-row items-center justify-center bg-hero bg-cover bg-center px-6 pt-16 md:pt-20 lg:pt-20"
    >
      {/* Left Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 text-center md:text-left p-4 lg:max-w-2xl lg:text-center"
      >
        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 leading-tight text-[color:var(--primary)]">
          Learn then, <br /> Earn Today
        </h1>

        {/* Subheadline */}
        <p className="mb-4 text-base md:text-lg xl:text-xl 2xl:text-2xl text-[color:var(--foreground)]">
          Break free from the chains of the matrix. Join successful traders learning profitable strategies and building wealth through forex trading.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start lg:justify-center">
          <a href="#mentorship" className="px-5 py-2 rounded transition text-base md:text-lg xl:text-xl
              bg-[color:var(--primary)] text-[color:var(--primary-foreground)]
              dark:bg-[color:var(--primary)] dark:text-[color:var(--foreground)]
              hover:brightness-90"
          >
            Start Trading Today
          </a>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 flex justify-center md:justify-end mb-4 md:mb-0 lg:justify-center"
      >
        <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 xl:w-[20rem] xl:h-[20rem] 2xl:w-[24rem] 2xl:h-[24rem] rounded-full overflow-hidden border-4 border-[color:var(--primary)] shadow-lg">
          <Image
            src="/assets/channels4_profile.jpg"
            alt="Trading Image"
            width={384}
            height={384}
            className="object-cover w-full h-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
