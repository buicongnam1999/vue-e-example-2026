<script setup lang="ts">
import SegmentLoader from '@/components/SegmentLoader.vue';

</script>

<template>
    <div class="relative h-full">
        <div class="flex h-full flex-col lg:flex-row">
            <main class="flex-1">
                <div class="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                    <SegmentLoader />
                </div>
            </main>
        </div>
    </div>
</template>