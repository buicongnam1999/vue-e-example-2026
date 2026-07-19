import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isEmail(val: string): Boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
} 