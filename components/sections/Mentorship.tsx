"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const mentorshipPlans = [
  {
    name: "Online Class",
    price: "300k RWF",
    features: [
      "Duration: 6 Weeks",
      "Lifetime Mentorship: Real growth takes time. We stay by your side—always.",
      "Remote doesn’t mean alone: Learn from anywhere, we’re with you wherever you grow.",
      "📅 Registration Deadline: 29th October",
      "⚡ Limited spots available — secure yours today!",
    ],
  },
  {
    name: "Physical Class",
    price: "400k RWF",
    features: [
      "Duration: 8 Weeks",
      "Location: Remera Kisementi, Ikaze House",
      "First 2 Weeks: Learn from home with lessons sent directly to your phone",
      "Lifetime Mentorship: Continuous support throughout your journey",
      "📅 Registration Deadline: 29th October",
    ],
  },
];

// Payment + Help Info (from flyer)
const paymentInfo = {
  help: "0783165788",
  momoCode: "644696 / Samuel",
  momoNumber: "0783165788 / Ahishakiye Samuel",
  bkAccount: "000490777151864 / Ahishakiye Samuel",
};

export default function Mentorship() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <section
      id="mentorship"
      className="w-full py-16 px-4 bg-background text-foreground"
    >
      <div className="w-full max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[color:var(--primary)]">
          Mentorship Programs
        </h2>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mentorshipPlans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-card p-8 rounded-2xl shadow-lg border border-border flex flex-col items-center text-center backdrop-blur-md"
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-xl font-bold mb-4 text-[color:var(--primary)]">
                {plan.price}
              </p>
              <ul className="mb-6 space-y-2 text-sm md:text-base">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-center justify-start gap-2 ${
                      feature.includes("Deadline") ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    <Check className="w-4 h-4 text-[color:var(--primary)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan)}
                className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-6 py-2.5 rounded-xl hover:scale-105 transition-transform font-medium shadow-md"
              >
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card p-8 rounded-2xl shadow-xl w-[90%] max-w-md relative text-center"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-semibold mb-2 text-[color:var(--primary)]">
              {selectedPlan.name}
            </h3>
            <p className="text-lg font-bold mb-4">{selectedPlan.price}</p>

            <div className="text-sm text-left space-y-2">
              <p>
                <span className="font-semibold">📞 For help & confirmation:</span>{" "}
                {paymentInfo.help}
              </p>
              <p>
                <span className="font-semibold">📲 MOMO Code:</span>{" "}
                {paymentInfo.momoCode}
              </p>
              <p>
                <span className="font-semibold">📲 MOMO Number:</span>{" "}
                {paymentInfo.momoNumber}
              </p>
              <p>
                <span className="font-semibold">🏦 BK Account:</span>{" "}
                {paymentInfo.bkAccount}
              </p>
            </div>

            <button
              onClick={() => setSelectedPlan(null)}
              className="mt-6 w-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-5 py-2 rounded-xl hover:brightness-90 transition font-medium"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
