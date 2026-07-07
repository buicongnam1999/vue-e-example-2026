<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Component } from "vue";

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
                    "bg-zinc-200",
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
                xs: "h-7 px-2 text-[11px]",
                sm: "h-8 px-3 text-xs",
                default: "h-7 px-4 text-sm",
                lg: "h-10 px-5 text-base",
                icon: "h-7 w-6 p-0",
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
        icon?: Component;
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
            props.icon && 'pl-0',
            buttonClass
        )">
            <span v-if="props.icon" class="mr-2 flex h-full items-center justify-center bg-black/10 px-1.5">
                <component :is="props.icon" :size="14" />
            </span>

            <slot />
        </button>
    </div>
</template>