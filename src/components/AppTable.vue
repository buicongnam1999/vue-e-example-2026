<template>
    <div
        class="w-full flex flex-col h-full bg-white font-sans text-[14px] text-[var(--color-secondary-900)] p-6 rounded-xl shadow-xs">

        <div v-if="title" class="shrink-0 mb-6 font-bold text-2xl text-[var(--color-primary-900)]">
            {{ title }}
        </div>

        <div class="shrink-0 flex items-center justify-between mb-3 text-[var(--color-secondary-700)]">
            <div>
                Total <span class="font-bold text-[var(--color-primary-900)]">{{ data.length }}</span>
            </div>
        </div>

        <div class="flex-1 min-h-0 min-w-0 overflow-x-auto overflow-y-auto border-t border-secondary-600">
            <table class="w-full min-w-[800px] border-collapse">
                <thead class="sticky top-0 z-20 bg-white select-none text-base font-bold">
                    <tr class="border-b border-[var(--color-secondary-400)]">
                        <th class="w-16 text-left py-2">
                            No
                        </th>
                        <th v-for="(col, index) in columns" :key="String(col.key) + index"
                            class="text-left whitespace-nowrap px-3 py-2">
                            {{ col.header }}
                        </th>
                        <th v-if="hasActions" class="w-24 text-center py-2">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-[var(--color-secondary-300)]">
                    <tr v-for="(item, rowIndex) in paginatedData" :key="item.id ?? rowIndex"
                        class="hover:bg-[var(--color-primary-50)] hover:cursor-pointer transition-colors group">

                        <td class="py-2 text-[var(--color-secondary-700)] font-normal">
                            {{ (currentPage - 1) * pageSize + rowIndex + 1 }}
                        </td>

                        <td v-for="(col, colIndex) in columns" :key="colIndex"
                            class="py-2 px-3 whitespace-nowrap text-[var(--color-secondary-800)] group-hover:text-[var(--color-primary-900)] font-normal">
                            <slot :name="`col-${String(col.key)}`" :item="item" :value="item[col.key]">
                                {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : "" }}
                            </slot>
                        </td>

                        <td v-if="hasActions" class="py-2 text-center">
                            <div class="flex justify-center gap-1.5">
                                <Button type="button" @click.stop="emit('choose', item, 'edit')">
                                    Sửa
                                </Button>
                                <Button variant="destructive" type="button"
                                    @click.stop="emit('choose', item, 'delete')">
                                    Xóa
                                </Button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="data.length === 0">
                        <td :colspan="columns.length + (hasActions ? 2 : 1)"
                            class="text-center py-10 text-[var(--color-secondary-600)] italic bg-white">
                            Không có dữ liệu
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            class="shrink-0 mt-4 pt-4 border-t border-[var(--color-secondary-300)] flex items-center justify-between text-[13px] text-[var(--color-secondary-700)] select-none">

            <div class="flex items-center gap-1.5">
                <span>Hiển thị:</span>
                <select v-model="pageSize" @change="currentPage = 1"
                    class="h-8 px-3 bg-white border border-[var(--color-secondary-400)] rounded-md outline-none text-[13px] cursor-pointer focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)]">
                    <option :value="10">10 dòng</option>
                    <option :value="20">20 dòng</option>
                    <option :value="50">50 dòng</option>
                </select>
            </div>

            <div class="flex items-center gap-2">
                <Button type="button" :disabled="currentPage === 1" @click="currentPage = 1">
                    <ChevronsLeft :size="15" />
                </Button>
                <Button type="button" :disabled="currentPage === 1" @click="currentPage--">
                    <ChevronLeft :size="15" />
                </Button>

                <span class="px-2 font-medium text-[var(--color-secondary-800)]">
                    Trang {{ currentPage }} / {{ totalPages || 1 }}
                </span>

                <Button type="button" :disabled="currentPage === totalPages || totalPages === 0" @click="currentPage++">
                    <ChevronRight :size="15" />
                </Button>
                <Button type="button" :disabled="currentPage === totalPages || totalPages === 0"
                    @click="currentPage = totalPages">
                    <ChevronsRight :size="15" />
                </Button>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts" generic="TData extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import Button from './Button.vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

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