"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    title: "Proven Strategy",
    description: "Time-tested approach with consistent results",
    icon: TrendingUp,
  },
  {
    title: "Risk Management",
    description: "Protect your capital with smart position sizing",
    icon: Shield,
  },
  {
    title: "Profit Maximization",
    description: "Optimize your trades for maximum returns",
    icon: Zap,
  },
];

export default function SystemSection() {
  return (
    <section id="system" className="w-full py-12 px-4 bg-background text-foreground">
      <div className="max-w-5xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-6">
        {/* Left side: YouTube video */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[color:var(--primary)]">
            The System <br /> That Works
          </h2>
          <p className="text-sm md:text-base lg:text-lg">
            Discover the trading methodology that has transformed thousands of traders worldwide.
          </p>

          {/* Responsive YouTube container */}
          <div className="w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/jILLeVogSh0?si=KrC11JkqQNpaYcS7"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Right side: Features + CTA */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 flex flex-col gap-3 items-center lg:items-start text-center lg:text-left"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0,0,0,0.12)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-card p-3 rounded-lg shadow-sm border border-border flex flex-col items-center lg:items-start text-center lg:text-left gap-1 w-full"
              >
                <Icon className="w-6 h-6 mb-1 text-[color:var(--primary)]" />
                <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
                <p className="text-xs md:text-sm">{feature.description}</p>
              </motion.div>
            );
          })}

          {/* CTA button below features */}
          <button className="mt-4 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-5 py-2 rounded-full hover:brightness-90 transition text-sm md:text-base">
            Start Trading Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}
