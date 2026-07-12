<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
});

withDefaults(
    defineProps<{
        error?: string;
        containerClass?: string;
        inputClass?: string;
        placeHolder?: string;
    }>(),
    {
        containerClass: "",
        inputClass: "",
    }
);

const model = defineModel<string | number>();
</script>

<template>
    <div :class="[
        'w-full flex flex-col gap-1.5',
        containerClass
    ]">
        <div :class="[
            'h-9 w-full bg-white border border-secondary-500 rounded-md px-3.5 flex items-center transition-all',
            'focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400',
            error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
        ]">
            <input v-model="model" v-bind="$attrs" :class="[
                'w-full bg-transparent border-none outline-none text-left font-sans',
                'h-[calc(100%-4px)]',
                'leading-[24px]',
                'tracking-normal',
                'text-[#333]',
                'whitespace-pre',
                'truncate',
                'disabled:cursor-not-allowed disabled:text-secondary-500',
                inputClass,
            ]" :placeholder="placeHolder" />
        </div>

        <p v-if="error" class="text-xs text-red-500 mt-0.5">
            {{ error }}
        </p>
    </div>
</template>