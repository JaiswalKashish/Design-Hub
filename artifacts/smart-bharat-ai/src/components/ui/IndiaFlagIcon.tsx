import React from "react";

export function IndiaFlagIcon({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-md border border-border shadow-sm shrink-0 bg-white ${className}`}>
      <div className="bg-[#FF9933] h-[33.3%] w-full" />
      <div className="bg-white h-[33.3%] w-full flex items-center justify-center relative">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#000080] animate-spin"
          style={{ animationDuration: "20s" }}
        >
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle cx="50" cy="50" r="10" fill="currentColor" />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="4"
            />
          ))}
        </svg>
      </div>
      <div className="bg-[#138808] h-[33.3%] w-full" />
    </div>
  );
}
