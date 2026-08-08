"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/60166620448"
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        fixed
        bottom-4
        right-4
        z-50
        sm:bottom-6
        sm:right-6
      "
    >
      <div
        className="
          flex
          items-center
          overflow-hidden
          rounded-full
          border
          border-white/10
          bg-black
          text-white
          shadow-2xl
          transition-all
          duration-500
          hover:scale-105
          hover:shadow-black/30
        "
      >
        {/* Icon */}
        <div
          className="
            relative
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            sm:h-16
            sm:w-16
          "
        >
          <MessageCircle
            size={23}
            className="sm:h-[26px] sm:w-[26px]"
          />

          {/* Online Dot */}
          <span
            className="
              absolute
              right-3
              top-3
              h-2.5
              w-2.5
              rounded-full
              bg-green-500
              ring-2
              ring-black
              animate-pulse
              sm:right-4
              sm:top-4
              sm:h-3
              sm:w-3
            "
          />
        </div>

        {/* Text */}
        <div
          className="
            max-w-0
            overflow-hidden
            transition-all
            duration-500
            group-hover:max-w-xs
          "
        >
          <div className="whitespace-nowrap pr-8">
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
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