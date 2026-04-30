"use client";

import { cn } from "@/lib/utils";

type OracleState = "idle" | "thinking" | "complete";

interface OracleCharacterProps {
  state?: OracleState;
  className?: string;
  size?: number;
}

export function OracleCharacter({
  state = "idle",
  className,
  size = 220,
}: OracleCharacterProps) {
  const isThinking = state === "thinking";
  const isComplete = state === "complete";

  return (
    <div
      className={cn("relative flex flex-col items-center", className)}
      style={{ width: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer pulsing glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-2xl transition-all duration-1000",
            isThinking
              ? "bg-primary/30 animate-pulse scale-110"
              : isComplete
              ? "bg-emerald-500/20"
              : "bg-primary/15"
          )}
        />

        <svg
          viewBox="0 0 220 220"
          width={size}
          height={size}
          className="relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="faceGrad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#0d1f3c" />
              <stop offset="100%" stopColor="#060d1a" />
            </radialGradient>
            <radialGradient id="eyeGlowL" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="1" />
              <stop offset="70%" stopColor="#00b8d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="eyeGlowR" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="1" />
              <stop offset="70%" stopColor="#00b8d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="faceClip">
              <ellipse cx="110" cy="118" rx="52" ry="60" />
            </clipPath>
          </defs>

          {/* === OUTER DECORATIVE RINGS === */}
          <circle
            cx="110" cy="110" r="105"
            fill="none" stroke="#00e5ff" strokeWidth="0.6" opacity="0.15"
            strokeDasharray="6 4"
          />
          <circle
            cx="110" cy="110" r="100"
            fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.25"
          >
            {isThinking && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 110 110"
                to="360 110 110"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* Rotating dashes ring */}
          <circle
            cx="110" cy="110" r="97"
            fill="none" stroke="#00e5ff" strokeWidth="0.8" opacity="0.4"
            strokeDasharray="3 10"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 110 110"
              to={isThinking ? "360 110 110" : "-360 110 110"}
              dur={isThinking ? "2s" : "12s"}
              repeatCount="indefinite"
            />
          </circle>

          {/* Corner bracket decorations */}
          <path d="M 18 18 L 18 36 L 36 36" fill="none" stroke="#00e5ff" strokeWidth="1.5" opacity="0.5" />
          <path d="M 202 18 L 202 36 L 184 36" fill="none" stroke="#00e5ff" strokeWidth="1.5" opacity="0.5" />
          <path d="M 18 202 L 18 184 L 36 184" fill="none" stroke="#00e5ff" strokeWidth="1.5" opacity="0.5" />
          <path d="M 202 202 L 202 184 L 184 184" fill="none" stroke="#00e5ff" strokeWidth="1.5" opacity="0.5" />

          {/* === BACKGROUND CIRCLE === */}
          <circle cx="110" cy="110" r="88" fill="#060d1a" />
          <circle cx="110" cy="110" r="88" fill="none" stroke="#00e5ff" strokeWidth="1.2" opacity="0.3" />

          {/* === GEOMETRIC HAIR / CROWN === */}
          <path
            d="M 62 85 L 58 66 L 72 75 L 82 54 L 93 69 L 110 48 L 127 69 L 138 54 L 148 75 L 162 66 L 158 85 Z"
            fill="#0d1f3c"
          />
          <path
            d="M 62 85 L 58 66 L 72 75 L 82 54 L 93 69 L 110 48 L 127 69 L 138 54 L 148 75 L 162 66 L 158 85 Z"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1"
            opacity="0.7"
            filter="url(#softGlow)"
          />
          {/* Crown highlight dots */}
          <circle cx="110" cy="48" r="2.5" fill="#00e5ff" opacity="0.9" filter="url(#glow)" />
          <circle cx="82" cy="54" r="1.8" fill="#00e5ff" opacity="0.6" />
          <circle cx="138" cy="54" r="1.8" fill="#00e5ff" opacity="0.6" />

          {/* === FACE BASE === */}
          <ellipse cx="110" cy="122" rx="52" ry="60" fill="url(#faceGrad)" />
          <ellipse cx="110" cy="122" rx="52" ry="60" fill="none" stroke="#00e5ff" strokeWidth="0.6" opacity="0.2" />

          {/* === SCAN LINE (thinking state) === */}
          {isThinking && (
            <rect
              x="58" y="85" width="104" height="2"
              fill="#00e5ff" opacity="0.3"
              clipPath="url(#faceClip)"
            >
              <animate
                attributeName="y"
                from="85"
                to="175"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.4;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>
          )}

          {/* === LEFT EYE === */}
          {/* Eye socket */}
          <ellipse cx="88" cy="113" rx="18" ry="14" fill="#03111f" />
          {/* Iris glow */}
          <ellipse cx="88" cy="113" rx="15" ry="11" fill="url(#eyeGlowL)" opacity={isThinking ? "1" : "0.85"} filter="url(#glow)">
            {isThinking && (
              <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />
            )}
          </ellipse>
          {/* Pupil */}
          <circle cx="88" cy="113" r="7" fill="#001a2e" />
          {/* Pupil glow center */}
          <circle cx="88" cy="113" r="3.5" fill="#00e5ff" opacity="0.95" filter="url(#glow)" />
          {/* Specular highlight */}
          <circle cx="91.5" cy="109.5" r="2" fill="white" opacity="0.75" />
          <circle cx="85" cy="117" r="1" fill="white" opacity="0.3" />
          {/* Eye rim */}
          <ellipse cx="88" cy="113" rx="15" ry="11" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />

          {/* === RIGHT EYE === */}
          <ellipse cx="132" cy="113" rx="18" ry="14" fill="#03111f" />
          <ellipse cx="132" cy="113" rx="15" ry="11" fill="url(#eyeGlowR)" opacity={isThinking ? "1" : "0.85"} filter="url(#glow)">
            {isThinking && (
              <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />
            )}
          </ellipse>
          <circle cx="132" cy="113" r="7" fill="#001a2e" />
          <circle cx="132" cy="113" r="3.5" fill="#00e5ff" opacity="0.95" filter="url(#glow)" />
          <circle cx="135.5" cy="109.5" r="2" fill="white" opacity="0.75" />
          <circle cx="129" cy="117" r="1" fill="white" opacity="0.3" />
          <ellipse cx="132" cy="113" rx="15" ry="11" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />

          {/* === NOSE (subtle) === */}
          <path d="M 107 130 L 110 135 L 113 130" fill="none" stroke="#00e5ff" strokeWidth="0.8" opacity="0.3" />

          {/* === MOUTH === */}
          <path
            d={isComplete ? "M 96 148 Q 110 156 124 148" : isThinking ? "M 98 148 Q 110 151 122 148" : "M 97 148 Q 110 154 123 148"}
            fill="none"
            stroke="#00e5ff"
            strokeWidth="1.2"
            opacity="0.55"
            strokeLinecap="round"
          />

          {/* === CIRCUIT MARKS ON CHEEKS === */}
          {/* Left cheek circuit */}
          <line x1="62" y1="120" x2="70" y2="120" stroke="#00e5ff" strokeWidth="0.7" opacity="0.45" />
          <line x1="62" y1="120" x2="62" y2="110" stroke="#00e5ff" strokeWidth="0.7" opacity="0.45" />
          <circle cx="62" cy="110" r="1.2" fill="#00e5ff" opacity="0.5" />
          <line x1="66" y1="128" x2="70" y2="128" stroke="#00e5ff" strokeWidth="0.6" opacity="0.3" />

          {/* Right cheek circuit */}
          <line x1="158" y1="120" x2="150" y2="120" stroke="#00e5ff" strokeWidth="0.7" opacity="0.45" />
          <line x1="158" y1="120" x2="158" y2="110" stroke="#00e5ff" strokeWidth="0.7" opacity="0.45" />
          <circle cx="158" cy="110" r="1.2" fill="#00e5ff" opacity="0.5" />
          <line x1="154" y1="128" x2="150" y2="128" stroke="#00e5ff" strokeWidth="0.6" opacity="0.3" />

          {/* === CHIN DATA NODES === */}
          <line x1="88" y1="172" x2="132" y2="172" stroke="#00e5ff" strokeWidth="0.6" opacity="0.3" />
          <circle cx="88" cy="172" r="1.5" fill="#00e5ff" opacity="0.4" />
          <circle cx="110" cy="172" r="1.5" fill="#00e5ff" opacity="0.4" />
          <circle cx="132" cy="172" r="1.5" fill="#00e5ff" opacity="0.4" />

          {/* === NECK / COLLAR === */}
          <rect x="97" y="176" width="26" height="8" rx="2" fill="#0d1f3c" stroke="#00e5ff" strokeWidth="0.5" opacity="0.4" />

          {/* === STATUS INDICATOR === */}
          <circle
            cx="110" cy="200" r="3"
            fill={isThinking ? "#facc15" : isComplete ? "#22c55e" : "#00e5ff"}
            opacity="0.9"
            filter="url(#softGlow)"
          >
            {isThinking && (
              <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
            )}
          </circle>
        </svg>
      </div>

      {/* Character name badge */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors duration-500",
            isThinking ? "bg-yellow-400 animate-pulse" : isComplete ? "bg-emerald-400" : "bg-primary"
          )} />
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            ORACLE
          </span>
          <div className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors duration-500",
            isThinking ? "bg-yellow-400 animate-pulse" : isComplete ? "bg-emerald-400" : "bg-primary"
          )} />
        </div>
        <span className="text-xs text-muted-foreground tracking-wide">
          {isThinking ? "Simulating futures..." : isComplete ? "Analysis complete" : "AI Life Oracle"}
        </span>
      </div>
    </div>
  );
}
