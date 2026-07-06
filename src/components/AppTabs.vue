<script setup lang="ts">
import { useTabsStore } from '@/store/tabs'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const tabs = useTabsStore()

const draggedIndex = ref<number | null>(null)

const open = (path: string) => {
    router.push(path)
}

const close = (path: string) => {
    tabs.removeTab(path)
    if (tabs.activePath) {
        router.push(tabs.activePath)
    }
}

const handleDragStart = (index: number) => {
    draggedIndex.value = index
}

const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault()
}

const handleDrop = (index: number) => {
    if (draggedIndex.value !== null) {
        tabs.reorderTabs(draggedIndex.value, index)
    }
    draggedIndex.value = null
}

const handleDragEnd = () => {
    draggedIndex.value = null
}
</script>

<template>
    <div class="flex items-end border-b bg-[#f5f5f5] overflow-x-auto select-none">
        <div v-for="(tab, index) in tabs.tabs" :key="tab.path" draggable="true" @dragstart="handleDragStart(index)"
            @dragover="handleDragOver($event, index)" @drop="handleDrop(index)" @dragend="handleDragEnd"
            class="relative flex items-center gap-2 px-4 h-8 cursor-pointer border-r border-gray-200 transition-all"
            :class="[
                tab.path === tabs.activePath ? 'bg-white text-black font-medium' : 'bg-[#ececec] text-gray-600 hover:bg-[#e5e5e5]',
                draggedIndex === index ? 'opacity-40' : ''
            ]" @click="open(tab.path)">

            <div v-if="tab.path === tabs.activePath" class="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />

            <span class="text-sm truncate max-w-[140px] pointer-events-none">
                {{ tab.title }}
            </span>

            <button v-if="tab.closable" class="ml-1 text-gray-500 hover:text-red-500 text-xs"
                @click.stop="close(tab.path)">
                ✕
            </button>
        </div>
    </div>
</template>