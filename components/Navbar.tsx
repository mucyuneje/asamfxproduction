"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  // Fix hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // avoid SSR mismatch

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const isSignedIn = session?.user;

  const navLinks = ["Home", "Courses", "Mentorship"];

  return (
    <nav className="fixed w-full z-50 bg-background/90 backdrop-blur-md shadow-sm border-b border-border transition-colors duration-500">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">AsamFXAcademy</div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}

          {isSignedIn ? (
            <>
              <a
                href="/dashboard"
                className="flex items-center px-4 py-2 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:brightness-90 transition"
              >
                <User className="mr-2" /> {session.user?.name || "Account"}
              </a>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center px-4 py-2 rounded bg-destructive text-destructive-foreground hover:brightness-90 transition"
              >
                <LogOut className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 rounded transition bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:brightness-90"
            >
              Join Now
            </a>
          )}

          <button onClick={toggleTheme} className="ml-4">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleTheme} className="mr-4">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>

      {/* Mobile Menu Animate */}
      {open && (
        <div className="md:hidden bg-background/95 border-t border-border overflow-hidden p-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}

          {isSignedIn ? (
            <>
              <a
                href="/dashboard"
                className="flex items-center px-4 py-2 rounded bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:brightness-90 transition"
              >
                <User className="mr-2" /> {session.user?.name || "Account"}
              </a>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center px-4 py-2 rounded bg-destructive text-destructive-foreground hover:brightness-90 transition"
              >
                <LogOut className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 rounded transition bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:brightness-90"
            >
              Join Now
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
