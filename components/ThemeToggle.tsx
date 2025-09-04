"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const next = theme === "dark" ? "light" : "dark";

  return (
    <motion.button
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="w-10 h-10 inline-flex items-center justify-center rounded-xl border shadow-sm"
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundColor: theme === "dark" ? "var(--background)" : "var(--accent)",
        color: theme === "dark" ? "var(--foreground)" : "var(--accent-foreground)",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {theme === "light" ? <Moon size={18} /> :<Sun size={18} /> }
    </motion.button>
  );
}
