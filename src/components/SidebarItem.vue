<script setup lang="ts">
import type { SidebarMenu } from "@/types/sidebar";
import { ChevronDown, ChevronRight, Dot } from "lucide-vue-next";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = withDefaults(
    defineProps<{
        route: SidebarMenu;
        depth?: number;
    }>(),
    {
        depth: 0,
    }
);
const router = useRouter();
const open = ref(false);

const depth = computed(() => props.depth ?? 0);

const itemClass = computed(() => {
    switch (props.depth) {
        case 0:
            return "text-[14px] font-medium";
        case 1:
            return "text-[14px] font-normal";
        default:
            return "text-[13px] font-light";
    }
});

const hasChildren = computed(() => {
    return !!props.route.children?.length;
});

const toggle = () => {
    if (hasChildren.value) {
        open.value = !open.value;
        return;
    }

    if (props.route.path) {
        router.push(props.route.path);
    }
};

const onClickIcon = (e: MouseEvent) => {
    e.stopPropagation();
    open.value = !open.value;
};
</script>

<template>
    <div>
        <div class="flex items-center py-[5px] cursor-pointer hover:bg-gray-200 transition-colors" :class="itemClass"
            :style="{ paddingLeft: `${12 + depth * 7}px` }" @click="toggle">
            <span v-if="depth === 1" class="mr-1 flex h-4 w-4 items-center justify-center"
                @click.stop="onClickIcon">
                <ChevronDown v-if="open" :size="14" />
                <ChevronRight v-else :size="14" />
            </span>

            <span v-else-if="depth >= 2" class="mr-1 flex h-4 w-4 items-center justify-center">
                <Dot :size="16" />
            </span>

            <span class="leading-none" :class="itemClass">
                {{ route.title }}
            </span>
        </div>

        <div v-if="hasChildren && open">
            <SidebarItem v-for="child in route.children" :key="child.path || child.name || ''" :route="child"
                :depth="depth + 1" />
        </div>
    </div>
</template>