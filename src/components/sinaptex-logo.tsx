"use client";

import React from "react";

interface SinaptexIconProps {
  size?: number | string;
  className?: string;
  idPrefix?: string;
}

/**
 * Pure SVG Icon for the Stylized "S" Synaptic Business Nexus Mark.
 */
export function SinaptexIcon({
  size = 32,
  className = "",
  idPrefix = "sx",
}: SinaptexIconProps) {
  const gradId = `${idPrefix}-grad`;
  const gradGlow = `${idPrefix}-glow`;
  const gradNode = `${idPrefix}-node`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Logo Sinaptex S"
    >
      <defs>
        {/* Main Ribbon Gradient */}
        <linearGradient id={gradId} x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Ambient Glow */}
        <linearGradient id={gradGlow} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>

        {/* Synapse Node Highlight */}
        <radialGradient id={gradNode} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>

        {/* Drop shadow filter for 3D depth */}
        <filter id={`${idPrefix}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer Soft Background Glow */}
      <circle cx="60" cy="60" r="50" fill={`url(#${gradGlow})`} opacity="0.15" filter={`url(#${idPrefix}-shadow)`} />

      {/* Network Connection Web Subtle Lines (Synaptic Ecosystem) */}
      <path
        d="M36 34 L84 86 M84 34 L36 86"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeOpacity="0.1"
        strokeDasharray="3 4"
      />

      {/* Upper Loop of 'S' */}
      <path
        d="M84 36 C84 25, 74 18, 60 18 C44 18, 34 27, 34 40 C34 54, 46 60, 60 63 C76 66, 86 73, 86 86 C86 100, 74 106, 58 106 C42 106, 32 98, 32 86"
        stroke={`url(#${gradId})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Interlocking Secondary Circuit Ribbon for Futuristic 'S' */}
      <path
        d="M82 38 C82 48, 70 54, 58 57 C44 61, 36 67, 36 80"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Synaptic Nodes (Points of Connection in Ecosystem) */}
      {/* Top terminal */}
      <circle cx="84" cy="36" r="6" fill={`url(#${gradNode})`} />
      <circle cx="84" cy="36" r="2.5" fill="#ffffff" />

      {/* Center Nexus */}
      <circle cx="60" cy="63" r="5" fill="#38bdf8" />
      <circle cx="60" cy="63" r="2" fill="#ffffff" />

      {/* Bottom terminal */}
      <circle cx="32" cy="86" r="6" fill={`url(#${gradNode})`} />
      <circle cx="32" cy="86" r="2.5" fill="#ffffff" />

      {/* Satellite Intelligence Nodes */}
      <circle cx="34" cy="38" r="3.5" fill="#60a5fa" opacity="0.8" />
      <circle cx="86" cy="84" r="3.5" fill="#c084fc" opacity="0.8" />
    </svg>
  );
}

interface SinaptexLogoProps {
  variant?: "horizontal" | "vertical" | "compact" | "icon-only" | "badge";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  iconClassName?: string;
  theme?: "auto" | "dark" | "light";
}

export function SinaptexLogo({
  variant = "horizontal",
  size = "md",
  showTagline,
  taglineText = "Ekosistem Bisnis dan Layanan Cerdas",
  className = "",
  iconClassName = "",
  theme = "auto",
}: SinaptexLogoProps) {
  // Size mapping
  const sizeConfig = {
    xs: {
      iconSize: 22,
      titleClass: "text-sm font-bold tracking-tight",
      taglineClass: "text-[9px] tracking-normal",
      spacing: "gap-1.5",
    },
    sm: {
      iconSize: 28,
      titleClass: "text-base font-bold tracking-tight",
      taglineClass: "text-[10px] tracking-normal",
      spacing: "gap-2",
    },
    md: {
      iconSize: 36,
      titleClass: "text-xl font-bold tracking-tight",
      taglineClass: "text-xs tracking-normal",
      spacing: "gap-2.5",
    },
    lg: {
      iconSize: 48,
      titleClass: "text-2xl sm:text-3xl font-extrabold tracking-tight",
      taglineClass: "text-xs sm:text-sm tracking-normal",
      spacing: "gap-3.5",
    },
    xl: {
      iconSize: 64,
      titleClass: "text-3xl sm:text-4xl font-black tracking-tight",
      taglineClass: "text-sm sm:text-base tracking-normal",
      spacing: "gap-4",
    },
  }[size];

  // Theme color classes
  const titleColor =
    theme === "light"
      ? "text-zinc-900"
      : theme === "dark"
      ? "text-white"
      : "text-zinc-900 dark:text-white";

  const tagColor =
    theme === "light"
      ? "text-zinc-500"
      : theme === "dark"
      ? "text-zinc-400"
      : "text-zinc-500 dark:text-zinc-400";

  // Determine tagline visibility
  const isTaglineVisible =
    showTagline !== undefined
      ? showTagline
      : variant === "horizontal" || variant === "vertical";

  if (variant === "icon-only") {
    return (
      <SinaptexIcon
        size={sizeConfig.iconSize}
        className={iconClassName || className}
      />
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/90 ${className}`}
      >
        <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-2 shadow-inner dark:from-zinc-950 dark:to-black">
          <SinaptexIcon size={sizeConfig.iconSize} className={iconClassName} />
        </div>
        <div className="flex flex-col">
          <span className={`${sizeConfig.titleClass} ${titleColor} leading-none`}>
            Sinaptex
          </span>
          {isTaglineVisible && (
            <span className={`mt-1 ${sizeConfig.taglineClass} ${tagColor} font-medium leading-tight`}>
              {taglineText}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div
        className={`flex flex-col items-center text-center ${sizeConfig.spacing} ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-md dark:from-blue-500/30 dark:to-purple-500/30" />
          <SinaptexIcon
            size={sizeConfig.iconSize}
            className={`relative ${iconClassName}`}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className={`${sizeConfig.titleClass} ${titleColor} leading-tight`}>
            Sinaptex
          </span>
          {isTaglineVisible && (
            <span
              className={`mt-1 max-w-xs font-medium ${sizeConfig.taglineClass} ${tagColor} leading-snug`}
            >
              {taglineText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Compact variant (no tagline by default)
  if (variant === "compact") {
    return (
      <div className={`flex items-center ${sizeConfig.spacing} ${className}`}>
        <SinaptexIcon
          size={sizeConfig.iconSize}
          className={iconClassName}
        />
        <span className={`${sizeConfig.titleClass} ${titleColor} leading-none`}>
          Sinaptex
        </span>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={`flex items-center ${sizeConfig.spacing} ${className}`}>
      <div className="relative shrink-0">
        <SinaptexIcon
          size={sizeConfig.iconSize}
          className={iconClassName}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`${sizeConfig.titleClass} ${titleColor} leading-tight truncate`}>
          Sinaptex
        </span>
        {isTaglineVisible && (
          <span
            className={`${sizeConfig.taglineClass} ${tagColor} font-medium leading-tight truncate`}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
}
