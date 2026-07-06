<template>
    <label :class="[
        'flex items-center px-1.5 py-1 cursor-default whitespace-nowrap gap-2',
        checked ? 'bg-[#f2f2f2]' : ''
    ]">
        <span class="leading-[13px] text-black cursor-pointer">{{ label }}</span>
        <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)"
            class="mr-2 ml-0.5 w-3.5 h-3.5 cursor-pointer accent-[#0078d7]" />
    </label>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
})

defineEmits(['change'])
</script>