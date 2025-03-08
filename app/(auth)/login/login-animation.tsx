"use client";

interface LoginAnimationProps {
  className?: string;
}

export function LoginAnimation({ className }: LoginAnimationProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v9Z" />
        <path d="m17 9-3-3H9" />
        <path d="M12 13v2" />
        <path d="M12 9v2" />
      </svg>
    </div>
  );
} 