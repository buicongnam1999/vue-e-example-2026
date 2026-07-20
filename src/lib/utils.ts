import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isRef, type Ref } from "vue";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isEmail(val: string): Boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

export function convertObjectToParam<T extends object>(obj: T | Ref<T>) {
    const rawObj = isRef(obj) ? obj.value : obj;

    return new URLSearchParams(
        Object.entries(rawObj as Record<string, unknown>)
            .filter(([, v]) => v !== undefined && v !== null && v !== '')
            .map(([k, v]) => [k, String(v).trim()])
    ).toString();
}