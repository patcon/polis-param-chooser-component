import * as React from 'react';
import type { LucideProps } from "lucide-react";

export const PaintbrushSparkles: React.FC<LucideProps> = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className={`lucide lucide-paintbrush-sparkles-icon lucide-paintbrush-sparkles ${className}`}
    {...props}
  >
    <path d="m14.622 17.897-10.68-2.913" />
    <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
    <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />

    {/* Sparkles modified from WandSparklesIcon */}

    {/* Small top-right sparkle (too crowded) */}
    {/* <path d="M15 3H13" />
    <path d="M14 2v2" /> */}

    {/* Small bottom-left sparkle */}
    {/* <path d="M3 19v2" />
    <path d="M2 20H4" /> */}

    {/* Left large sparkle */}
    <path d="M4 3v4" />
    <path d="M6 5H2" />

    {/* Large bottom sparkle */}
    {/* <path d="M20 17v4" />
    <path d="M22 19h-4" /> */}

    {/* Small bottom sparkle */}
    <path d="M20 18v2" />
    <path d="M21 19H19" />
  </svg>
);
