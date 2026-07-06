<script setup lang="ts">
import { useFetch } from "@/hooks/useFetch";
import { ref, computed, watch } from "vue";
import Button from "./Button.vue";

interface Props {
    url: string;
    modelValue?: Record<string, any> | null;
    valueField?: string;
    descriptionField?: string;
    title?: string;
    label: string
}

const props = withDefaults(defineProps<Props>(), {
    valueField: "value",
    descriptionField: "description",
    title: "Select",
});

const emit = defineEmits<{
    (e: "update:modelValue", value: Record<string, any> | null): void;
    (e: "select", item: Record<string, any>): void;
}>();

/**
 * Popup state
 */
const open = ref(false);
const keyword = ref("");
const selectedItem = ref<Record<string, any> | null>(null);
const pageSize = ref(10);

/**
 * TanStack Query (useFetch wrapper)
 * - enabled: false => chỉ fetch khi mở popup
 */
const { data, isFetching, refetch } = useFetch<{
    list: Record<string, any>[];
    total: number;
}>({
    url: `${props.url}?pageSize=${pageSize.value}`,
    key: ["codeview", props.url, pageSize.value.toString()],
    options: {
        enabled: false,
    },
});

/**
 * Show popup + fetch data nếu chưa có
 */
async function openPopup() {
    open.value = true;

    if (!data.value?.list.length) {
        await refetch();
    }
}

/**
 * Select item
 */
function select(item: Record<string, any>) {
    emit("update:modelValue", item);
    emit("select", item);
    open.value = false;
}

const display = computed(() => {
    if (!props.modelValue) return null;

    return {
        description: props.modelValue[props.descriptionField],
        value: props.modelValue[props.valueField],
    };
});

const items = computed(() => {
    return data.value?.list ?? [];
});

const selectItem = (item: Record<string, any>) => {
    selectedItem.value = item
    emit("select", item)
    emit("update:modelValue", item)
    open.value = false
}

watch(
    () => props.modelValue,
    (val) => {
        selectedItem.value = val ?? null;
    },
    {
        immediate: true,
        deep: true,
    }
);

</script>

<template>
    <div class="grid grid-cols-4 gap-2">
        <div class="col-span-1">{{ label }}</div>
        <div class="col-span-3">
            <div class="grid grid-cols-2 h-6 cursor-pointer overflow-hidden border border-gray-400 bg-white"
                @click="openPopup">
                <div class="flex flex-1 items-center border-r px-2 text-sm">
                    {{ selectedItem?.[valueField] ?? "" }}
                </div>

                <div class="flex items-center px-2 text-sm bg-gray-200">
                    {{ selectedItem?.[descriptionField] ?? "" }}
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div class="flex h-[520px] w-[720px] flex-col rounded bg-white shadow-xl">
                <div class="flex items-center justify-between border-b px-2 py-2">
                    <div class="font-semibold">
                        {{ title }}
                    </div>

                    <Button variant="ghost" class="text-l" @click="open = false">
                        ✕
                    </Button>
                </div>

                <div class="p-2">
                    <input v-model="keyword" placeholder="Search..."
                        class="h-7 w-full border px-2 text-sm outline-none" />
                </div>
                <div class="flex gap-2">
                    <div class="mt-3 px-2">
                        Total: {{ data?.total }}
                    </div>
                    <div class="flex items-center gap-1.5 font-sans">
                        <select id="npp-pagesize" v-model="pageSize"
                            class="h-6 px-1 bg-white border border-gray-400 outline-none text-[13px] transition-colors focus:border-gray-500 cursor-pointer">
                            <option :value="10">10</option>
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                        </select>
                    </div>
                </div>
                <div class="flex-1 overflow-auto px-2 pt-2">
                    <table class="w-full border-collapse text-sm">
                        <thead class="sticky top-0 bg-gray-100">
                            <tr>
                                <th class="w-1/2 border px-3 py-1 text-left">
                                    Value
                                </th>

                                <th class="w-1/2 border px-3 py-1 text-left">
                                    Description
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in items" :key="item[valueField]" class="cursor-pointer hover:bg-blue-50"
                                @dblclick="selectItem(item)">
                                <td class="border px-3 py-2">
                                    {{ item[valueField] }}
                                </td>

                                <td class="border px-3 py-2">
                                    {{ item[descriptionField] }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="isFetching" class="p-4 text-center text-gray-500">
                        Loading...
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>