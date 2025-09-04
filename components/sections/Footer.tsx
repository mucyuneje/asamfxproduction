"use client";

import { Instagram, Twitter, Facebook, Youtube, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[hsl(217.2,32.6%,17.5%)] text-slate-300 text-[10px] px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-start">
        {/* Logo & description */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-bold mb-1">ASAMFOREX</h2>
          <p className="text-[10px] mb-2">
            Empowering traders worldwide with premium education and mentorship.
            Your journey to financial freedom starts here.
          </p>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-3">
            <a
              href="https://www.instagram.com/asam.fx/"
              aria-label="Instagram"
              className="hover:text-[color:var(--primary)]"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@Asamfx"
              aria-label="YouTube"
              className="hover:text-[color:var(--primary)]"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[color:var(--primary)]">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-[color:var(--primary)]">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Office */}
        <div className="flex-1 text-center md:text-right text-[10px] flex flex-col gap-1">
          <h3 className="font-semibold mb-0.5 flex items-center justify-center md:justify-end gap-1">
            <MapPin className="w-3 h-3" /> Kigali, Rwanda
          </h3>
          <p>Remera Kisementi, Ikaze House</p>
          <p className="mt-0.5">+250 783165788</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 text-[8px] text-gray-400 text-center md:text-left">
        <p>
          DISCLAIMER: AsamForex.com is an educational platform providing trading
          insights and mentorship. We are not a licensed financial institution,
          investment advisor, or brokerage. Trading in financial markets involves
          substantial risk. Users are responsible for their own trading decisions.
        </p>
        <p className="mt-1">© 2025 ASAMFOREX. All rights reserved.</p>
      </div>
    </footer>
  );
}
