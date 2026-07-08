<template>
    <div class="relative h-full bg-secondary-300 font-sans text-black p-2">
        <div class="flex h-full flex-col lg:flex-row gap-2">

            <Search>
                <slot name="filters" />
            </Search>

            <main class="flex-1 min-w-0 bg-white border border-[#adadad] p-2 flex flex-col relative">

                <div class="shrink-0 flex justify-between items-center pb-2 border-b border-[#e9e9e9] mb-2">
                    <div class="font-semibold text-[#222] text-sm">
                        {{ pageTitle }}
                    </div>
                    <div class="flex gap-2">
                        <Button variant="outline" class="h-7 text-emerald-700 hover:bg-emerald-50 border-[#adadad]"
                            @click="emit('export-excel')">
                            📊 Xuất Excel
                        </Button>

                        <slot name="actions" />
                    </div>
                </div>

                <div class="flex-1 min-h-0">
                    <slot name="table" />
                </div>

                <div v-if="isLoading"
                    class="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <SegmentLoader />
                </div>
            </main>

        </div>
    </div>
</template>

<script setup lang="ts">
import Search from './Search.vue'
import Button from './Button.vue'

withDefaults(
    defineProps<{
        pageTitle?: string
        isLoading?: boolean
    }>(),
    {
        pageTitle: 'Danh sách dữ liệu',
        isLoading: false
    }
)

const emit = defineEmits<{
    (e: 'search'): void
    (e: 'reset'): void
    (e: 'export-excel'): void
}>()
</script>