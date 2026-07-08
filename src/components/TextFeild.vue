<script setup lang="ts">
import { Search } from "lucide-vue-next";
import Label from "./Label.vue";
import Input from "./Input.vue";

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
        isSearch?: boolean;
        placeHolder?: string;
    }>(),
    {
        required: false,
        containerClass: "",
        inputClass: "",
        isSearch: true,
    }
);

const model = defineModel<string | number>();
</script>

<template>
    <div :class="['flex flex-col gap-1.5 font-sans', containerClass]">

        <Label v-if="label" size="base" :label="label" />

        <div class="relative w-full flex items-center">
            <Input v-model="model" v-bind="$attrs" :class="inputClass" :place-holder="placeHolder" />
            <div v-if="isSearch"
                class="absolute right-3 text-[var(--color-secondary-600)] pointer-events-none flex items-center justify-center">
                <Search class="h-4 w-4" stroke-width="2" />
            </div>
        </div>

        <p v-if="error" class="text-xs text-red-500 mt-0.5">
            {{ error }}
        </p>
    </div>
</template>