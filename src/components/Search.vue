<script setup lang="ts">
import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-vue-next";
import { ref } from "vue";
import Button from "./Button.vue";

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

const collapsed = ref(false);

const togglePanel = () => {
    collapsed.value = !collapsed.value;
};
</script>

<template>
    <div class="flex h-full flex-col border-b lg:border-b-0 transition-all duration-300 ease-in-out overflow-hidden"
        :class="collapsed ? 'w-8 px-1' : 'w-72 px-1'">
        <div class="flex h-8 shrink-0 items-center mb-2" :class="collapsed ? 'justify-center' : 'justify-end'">
            <div class="w-full flex justify-end" @click="togglePanel">
                <div class="text-gray-500 cursor-pointer">
                    <ChevronRight v-if="collapsed" :size="16" />
                    <ChevronLeft v-else :size="16" />
                </div>
            </div>
        </div>

        <template v-if="!collapsed">
            <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
                <slot />
            </div>

            <div class="mt-3 flex justify-end gap-2 pb-1">
                <Button variant="primary" :loading="loading" :icon="Search" @click="emit('search')">
                    Search
                </Button>

                <Button variant="outline" :disabled="loading" :icon="RotateCcw" @click="emit('reset')">
                    Reset
                </Button>
            </div>
        </template>
    </div>
</template>