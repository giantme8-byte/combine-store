"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/60166620448"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50"
    >
      <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-black text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-black/30">

        {/* Icon */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">

          <MessageCircle size={26} />

          {/* Online Dot */}
          <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-green-500 ring-2 ring-black animate-pulse" />

        </div>

        {/* Text */}
        <div className="max-w-0 overflow-hidden transition-all duration-500 group-hover:max-w-xs">
          <div className="whitespace-nowrap pr-8">

            <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
              Luxury Concierge
            </p>

            <p className="mt-1 text-base font-medium">
              Chat with us
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              Typically replies within minutes
            </p>

          </div>
        </div>

      </div>
    </a>
  );
}