<template>
    <div :class="['grid grid-cols-4 gap-2 items-center', containerClass]" ref="selectRef">

        <div class="col-span-1">
            <label v-if="label" class="text-sm font-medium text-gray-700 select-none">
                {{ label }}
                <span v-if="required" class="ml-1 text-red-500">*</span>
            </label>
        </div>

        <div class="col-span-3 relative font-sans text-[13px] text-black">

            <div @click="isOpen = !isOpen" :class="cn(
                'flex items-center justify-between bg-white min-h-[24px] py-0.5 px-1 text-[13px]',
                'transition-colors cursor-pointer outline-none border border-gray-400 select-none',
                isOpen ? 'border-gray-500 ring-1 ring-gray-400' : 'hover:border-gray-500',
                error && 'border-red-500 focus:border-red-500',
                selectClass
            )">
                <div class="flex flex-wrap gap-1 items-center max-w-[92%]">

                    <template v-if="multiple">
                        <template v-if="(modelValue as string[]).length > 0">
                            <div v-for="item in selectedItems" :key="item.value"
                                class="flex items-center bg-[#e1e1e1] border border-gray-400 px-1 py-0 h-[18px] text-[11px] text-[#222]"
                                @click.stop>
                                <span class="max-w-[100px] truncate">{{ item.label }}</span>
                                <button type="button" @click="removeValue(item.value)"
                                    class="ml-1 text-gray-500 hover:text-red-600 font-bold text-[13px] leading-none px-0.5">
                                    ×
                                </button>
                            </div>
                        </template>
                        <span v-else class="text-gray-400 pl-0.5 leading-5">{{ placeholder }}</span>
                    </template>

                    <template v-else>
                        <span v-if="modelValue" class="pl-0.5 leading-5 truncate">{{ singleSelectedLabel }}</span>
                        <span v-else class="text-gray-400 pl-0.5 leading-5">{{ placeholder }}</span>
                    </template>

                </div>

                <span class="text-[9px] text-[#555] pointer-events-none pr-1 self-center">▼</span>
            </div>

            <div v-if="isOpen"
                class="absolute left-0 z-50 w-full mt-0.5 bg-white border border-[#7a7a7a] shadow-md max-h-[180px] overflow-y-auto p-[2px]">
                <div v-for="item in items" :key="item.value" @click="selectItem(item.value)" :class="cn(
                    'px-2 py-1 cursor-default text-[#222] whitespace-nowrap transition-colors duration-100 select-none',
                    isCurrentSelected(item.value) ? 'bg-[#0078d7] text-white' : 'hover:bg-[#e5f3ff]'
                )">
                    <span class="leading-[13px]">{{ item.label }}</span>
                </div>

                <div v-if="items.length === 0" class="px-3 py-2 text-center text-gray-400 italic select-none">
                    Không có dữ liệu
                </div>
            </div>
        </div>

        <p v-if="error" class="col-span-4 text-xs text-red-500 mt-0.5">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
    inheritAttrs: false,
})

export interface OptionItem {
    label: string;
    value: string;
}

const props = withDefaults(
    defineProps<{
        items: OptionItem[]
        modelValue: string[] | string
        multiple?: boolean
        label?: string
        required?: boolean
        error?: string
        placeholder?: string
        containerClass?: string
        selectClass?: string
    }>(),
    {
        multiple: false,
        required: false,
        placeholder: '--- Chọn ---',
        containerClass: '',
        selectClass: ''
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[] | string): void
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const isCurrentSelected = (value: string) => {
    if (props.multiple) {
        return (props.modelValue as string[]).includes(value)
    }
    return props.modelValue === value
}

const selectedItems = computed(() => {
    if (!props.multiple) return []
    return props.items.filter(item => (props.modelValue as string[]).includes(item.value))
})

const singleSelectedLabel = computed(() => {
    if (props.multiple) return ''
    const found = props.items.find(item => item.value === props.modelValue)
    return found ? found.label : ''
})

const selectItem = (value: string) => {
    if (props.multiple) {
        const updatedValue = [...(props.modelValue as string[])]
        const index = updatedValue.indexOf(value)
        if (index > -1) {
            updatedValue.splice(index, 1)
        } else {
            updatedValue.push(value)
        }
        emit('update:modelValue', updatedValue)
    } else {
        emit('update:modelValue', value)
        isOpen.value = false
    }
}

const removeValue = (value: string) => {
    if (!props.multiple) return
    const updatedValue = (props.modelValue as string[]).filter(v => v !== value)
    emit('update:modelValue', updatedValue)
}

const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>