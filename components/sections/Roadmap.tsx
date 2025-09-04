"use client";

import { motion } from "framer-motion";
import { UserPlus, File, CreditCard, Users, TrendingUp } from "lucide-react";

const steps = [
  { step: 1, title: "Sign up for free", icon: UserPlus },
  { step: 2, title: "Choose Your Pathway", icon: File },
  { step: 3, title: "Subscribe to Plan", icon: CreditCard },
  { step: 4, title: "Access Community", icon: Users },
  { step: 5, title: "Start Earning", icon: TrendingUp },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="w-full py-12 px-4 bg-background text-foreground relative">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-[color:var(--primary)]">
          Your Roadmap to Financial Freedom
        </h2>
        <p className="text-sm md:text-base lg:text-lg mb-8">
          Follow our proven step-by-step system to transform your financial future
        </p>

        {/* Compact Vertical steps */}
        <div className="flex flex-col gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)]">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-semibold">{step.title}</h3>
                  <p className="text-xs md:text-sm text-[color:var(--foreground)]">
                    Step {step.step} in your journey to financial freedom.
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10">
          <p className="text-sm md:text-base lg:text-lg mb-3">
            Join thousands of successful traders who have already transformed their lives with our proven system.
          </p>
          <button className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-6 py-2 rounded-full hover:brightness-90 transition text-sm md:text-base lg:text-lg">
            START YOUR JOURNEY
          </button>
        </div>
      </div>
    </section>
  );
}
