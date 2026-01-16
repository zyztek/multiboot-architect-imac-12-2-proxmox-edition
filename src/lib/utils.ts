import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const verboseTextContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

export const verboseTextItem = {
  hidden: { opacity: 0, y: 10, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};
