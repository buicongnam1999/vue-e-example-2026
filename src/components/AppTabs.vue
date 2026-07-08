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
    <div
        class="flex items-end border-b border-secondary-400 bg-secondary-200 overflow-x-auto select-none pt-1 font-sans">
        <div v-for="(tab, index) in tabs.tabs" :key="tab.path" draggable="true" @dragstart="handleDragStart(index)"
            @dragover="handleDragOver($event, index)" @drop="handleDrop(index)" @dragend="handleDragEnd"
            class="relative flex items-center gap-2 px-5 h-10 cursor-pointer border-r border-secondary-400 transition-all duration-150"
            :class="[
                tab.path === tabs.activePath
                    ? 'bg-white text-primary-900 font-bold'
                    : 'bg-secondary-300 text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900',
                draggedIndex === index ? 'opacity-40' : ''
            ]" @click="open(tab.path)">

            <span class="text-base truncate max-w-[160px] pointer-events-none">
                {{ tab.title }}
            </span>

            <button v-if="tab.closable"
                class="ml-1 text-secondary-600 hover:text-red-500 font-medium text-base leading-none transition-colors p-0.5 rounded hover:bg-secondary-400/20"
                @click.stop="close(tab.path)">
                ×
            </button>

            <div v-if="tab.path === tabs.activePath" class="absolute top-0 left-0 right-0 h-[3px] bg-primary-500" />
        </div>
    </div>
</template>