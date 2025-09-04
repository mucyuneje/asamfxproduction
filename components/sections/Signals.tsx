"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$49 / month",
    features: ["5 Signals per week", "Email support", "Access to Telegram group"],
  },
  {
    name: "Pro",
    price: "$99 / month",
    features: ["15 Signals per week", "Priority support", "Access to Telegram & Discord"],
  },
  {
    name: "Premium",
    price: "$199 / month",
    features: ["Unlimited Signals", "1-on-1 mentorship", "VIP Community Access"],
  },
];

export default function SignalsPlans() {
  return (
    <section id="signals" className="w-full py-16 px-4 bg-background text-foreground">
      <div className="w-full max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[color:var(--primary)]">
          Signals Plans
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-card p-6 rounded-xl shadow-md border border-border flex flex-col items-center text-center"
            >
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">{plan.name}</h3>
              <p className="text-xl md:text-2xl font-bold mb-4 text-[color:var(--primary)]">{plan.price}</p>
              <ul className="mb-4 space-y-2 text-sm md:text-base">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center justify-start gap-2">
                    <Check className="w-4 h-4 text-[color:var(--primary)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-5 py-2 rounded hover:brightness-90 transition text-base md:text-lg">
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
