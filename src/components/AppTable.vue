<template>
    <div class="w-full flex flex-col h-full bg-[#f0f0f0] border border-[#adadad] font-sans text-[13px] text-black">

        <div v-if="title" class="shrink-0 px-2 py-1.5 bg-zinc-300 border-b border-[#adadad] font-semibold text-[#222]">
            {{ title }}
        </div>

        <div class="flex-1 min-h-0 min-w-0 overflow-x-auto overflow-y-auto bg-white p-[2px]">
            <table class="w-full min-w-[800px] border-collapse border border-[#d3d3d3]">

                <thead class="sticky top-0 z-20 bg-[#f0f0f0] select-none">
                    <tr>
                        <th class="w-12 border border-[#d3d3d3] bg-zinc-300 text-center font-normal py-1 text-[#222]">
                            No
                        </th>
                        <th v-for="(col, index) in columns" :key="String(col.key) + index"
                            class="border border-[#d3d3d3] bg-zinc-300 text-left px-2 py-1 font-normal text-[#222] whitespace-nowrap">
                            {{ col.header }}
                        </th>
                        <th v-if="hasActions"
                            class="w-24 border border-[#d3d3d3] bg-zinc-300 text-center font-normal py-1 text-[#222]">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(item, rowIndex) in paginatedData" :key="item.id ?? rowIndex"
                        class="hover:bg-zinc-200 hover:cursor-pointer odd:bg-white even:bg-zinc-100 border-b border-[#e9e9e9]">
                        <td class="border border-[#d3d3d3] text-center text-gray-500 py-2 bg-[#f5f5f5] select-none">
                            {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
                        </td>

                        <td v-for="(col, colIndex) in columns" :key="colIndex"
                            class="border border-[#d3d3d3] px-2 py-2 whitespace-nowrap text-[#111]">
                            <slot :name="`col-${String(col.key)}`" :item="item" :value="item[col.key]">
                                {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : "" }}
                            </slot>
                        </td>

                        <td v-if="hasActions" class="border border-[#d3d3d3] text-center py-0.5 px-2">
                            <div class="flex justify-center gap-1">
                                <Button type="button" @click="emit('choose', item, 'edit')">
                                    Sửa
                                </Button>
                                <Button variant="destructive" type="button" @click="emit('choose', item, 'delete')">
                                    Xóa
                                </Button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="data.length === 0">
                        <td :colspan="columns.length + (hasActions ? 2 : 1)"
                            class="text-center py-6 text-gray-400 italic bg-white">
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="shrink-0 border-t border-[#adadad] bg-[#f0f0f0] px-3 py-1.5 flex items-center justify-between text-xs text-[#222] select-none">

            <div class="text-sm">
                Tổng số: <span class="font-semibold">{{ data.length }}</span> dòng
            </div>

            <div class="flex items-center gap-3 text-sm">
                <div class="flex items-center gap-1">
                    <span>Hiển thị:</span>
                    <select v-model="pageSize" @change="currentPage = 1"
                        class="h-7 px-4 bg-white border border-[#adadad] outline-none text-[12px] cursor-pointer focus:border-[#0078d7]">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                    </select>
                </div>

                <div class="flex items-center gap-1">
                    <Button type="button" :disabled="currentPage === 1" @click="currentPage = 1">
                        <ChevronsLeft :size="14" />
                    </Button>
                    <Button type="button" :disabled="currentPage === 1" @click="currentPage--">
                        <ChevronRight :size="14" />
                    </Button>

                    <span class="px-2">
                        Trang {{ currentPage }} / {{ totalPages || 1 }}
                    </span>

                    <Button type="button" :disabled="currentPage === totalPages || totalPages === 0"
                        @click="currentPage++">
                        <ChevronRight :size="14" />
                    </Button>
                    <Button type="button" :disabled="currentPage === totalPages || totalPages === 0"
                        @click="currentPage = totalPages">
                        <ChevronsRight :size="14" />
                    </Button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts" generic="TData extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import Button from './Button.vue';
import { ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

export interface TableColumn {
    key: string;
    header: string;
}

const props = withDefaults(
    defineProps<{
        title?: string
        data: TData[]
        columns: TableColumn[]
        useCanMutation?: boolean
    }>(),
    {
        useCanMutation: false
    }
)

const emit = defineEmits<{
    (e: 'choose', data: TData, type: 'edit' | 'delete'): void
}>()

const hasActions = computed(() => props.useCanMutation)

const currentPage = ref(1)
const pageSize = ref(10)

const totalPages = computed(() => {
    return Math.ceil(props.data.length / pageSize.value)
})

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return props.data.slice(start, end)
})

watch(() => props.data, () => {
    currentPage.value = 1
}, { deep: true })
</script>