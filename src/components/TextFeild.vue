<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
});

withDefaults(
    defineProps<{
        label?: string;
        required?: boolean;
        error?: string;
        containerClass?: string;
        inputClass?: string;
    }>(),
    {
        required: false,
        containerClass: "",
        inputClass: "",
    }
);

const model = defineModel<string | number>();
</script>

<template>
    <div :class="['grid grid-cols-4 gap-2', containerClass]">
        <div class="col-span-1">
            <label v-if="label" class="text-sm font-medium text-gray-700">
                {{ label }}

                <span v-if="required" class="ml-1 text-red-500">
                    *
                </span>
            </label>
        </div>
        <div class="col-span-3">
            <input v-model="model" v-bind="$attrs" :class="[
                'h-6 w-full border border-gray-400 bg-white px-1 text-[13px] leading-6 outline-none transition-colors',
                'focus:border-gray-500',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
                error && 'border-red-500 focus:border-red-500',
                inputClass,
            ]" />
        </div>
        <p v-if="error" class="text-xs text-red-500">
            {{ error }}
        </p>
    </div>
</template>