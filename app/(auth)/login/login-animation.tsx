"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Lottie = dynamic(() => import("@lottielab/lottie-player/react"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-full bg-muted/20" />,
});

interface LoginAnimationProps {
  className?: string;
}

export function LoginAnimation({ className }: LoginAnimationProps) {
  return (
    <div className={className}>
      <Lottie 
        src="https://cdn.lottielab.com/l/2kjr1Rf7aeBgZd.json" 
        autoplay 
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
} 