<script setup lang="ts">
import Button from './Button.vue';

interface Props {
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits<{
    (e: "search"): void;
    (e: "reset"): void;
}>();
</script>

<template>
    <div class="flex h-full flex-col py-2 px-1 border-b lg:shrink-0 lg:border-b-0 lg:border-r">
        <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
            <slot />
        </div>

        <div class="mt-3 flex justify-end gap-2">
            <Button variant="primary" :loading="loading" @click="emit('search')">
                Search
            </Button>

            <Button variant="outline" :disabled="loading" @click="emit('reset')">
                Reset
            </Button>
        </div>
    </div>
</template>