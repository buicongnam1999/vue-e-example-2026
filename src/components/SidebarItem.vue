<script setup lang="ts">
import type { SidebarMenu } from "@/types/sidebar";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
    route: SidebarMenu;
    depth?: number;
}>();

const router = useRouter();
const open = ref(false);

const depth = props.depth ?? 0;

const hasChildren = computed(() => {
    return !!props.route.children?.length;
});

const showIcon = computed(() => {
    return hasChildren.value && depth > 0;
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
        <div class="flex items-center gap-1 py-2 cursor-pointer hover:bg-gray-200 transition-colors text-[14px]"
            :style="{ paddingLeft: `${depth * 16 + 12}px` }" @click="toggle">
            <span v-if="showIcon" class="text-xs w-4 flex justify-center select-none" @click="onClickIcon">
                {{ open ? "▼" : "▶" }}
            </span>

            <span v-else-if="depth > 0" class="w-4"></span>

            <span>{{ props.route.title }}</span>
        </div>

        <div v-if="hasChildren && open">
            <SidebarItem v-for="child in props.route.children" :key="child.path || child.name || ''" :route="child"
                :depth="depth + 1" />
        </div>
    </div>
</template>