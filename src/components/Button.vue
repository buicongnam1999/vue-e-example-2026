<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

defineOptions({
    inheritAttrs: false,
});

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center whitespace-nowrap",
        "font-medium transition-all duration-150",
        "select-none",
        "disabled:pointer-events-none disabled:opacity-60",
        "outline-none",
        "cursor-pointer",
        "border",
    ],
    {
        variants: {
            variant: {
                default: [
                    // Notepad++
                    "bg-[#f0f0f0]",
                    "border-[#adadad]",
                    "text-[#222]",
                    "hover:bg-[#e6e6e6]",
                    "active:bg-[#d8d8d8]",
                ],

                primary: [
                    "bg-[#0078d7]",
                    "border-[#0063b1]",
                    "text-white",
                    "hover:bg-[#0a84ef]",
                    "active:bg-[#005fa3]",
                ],

                destructive: [
                    "bg-[#d13438]",
                    "border-[#b02a2e]",
                    "text-white",
                    "hover:bg-[#e74856]",
                    "active:bg-[#b02a2e]",
                ],

                outline: [
                    "bg-white",
                    "border-[#adadad]",
                    "text-[#222]",
                    "hover:bg-[#f7f7f7]",
                ],

                ghost: [
                    "bg-transparent",
                    "border-transparent",
                    "text-[#222]",
                    "hover:bg-[#e8e8e8]",
                ],

                link: [
                    "border-transparent",
                    "bg-transparent",
                    "text-[#0066cc]",
                    "underline-offset-4",
                    "hover:underline",
                    "px-0",
                ],
            },

            size: {
                xs: "h-6 px-2 text-[11px]",
                sm: "h-7 px-3 text-xs",
                default: "h-6 px-4 text-sm",
                lg: "h-10 px-5 text-base",
                icon: "h-6 w-6 p-0",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

const props = withDefaults(
    defineProps<{
        loading?: boolean;
        containerClass?: string;
        buttonClass?: string;
        variant?: ButtonVariants["variant"];
        size?: ButtonVariants["size"];
    }>(),
    {
        loading: false,
        containerClass: "",
        buttonClass: "",
        variant: "default",
        size: "default",
    }
);
</script>

<template>
    <div :class="containerClass">
        <button v-bind="$attrs" :disabled="loading || !!$attrs.disabled" :class="cn(
            buttonVariants({
                variant: props.variant,
                size: props.size,
            }),
            buttonClass
        )
            ">
            <slot />
        </button>
    </div>
</template>