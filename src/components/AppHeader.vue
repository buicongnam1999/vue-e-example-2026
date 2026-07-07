<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
    Minimize,
    CircleUserRound,
    Maximize,
} from "lucide-vue-next";
import Button from "./Button.vue";

const showMenu = ref(false);
const isFullscreen = ref(false);

const toggleMenu = () => {
    showMenu.value = !showMenu.value;
};

const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
};

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest(".avatar-box")) {
        showMenu.value = false;
    }
};

const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        isFullscreen.value = true;
    } else {
        await document.exitFullscreen();
        isFullscreen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <header class="flex h-14 items-center justify-between border-b border-[#adadad] bg-zinc-300 px-3 select-none font-sans text-[13px] text-white">
        <div class="font-bold text-[#222]">
            Logo
        </div>

        <div class="flex items-center gap-1">

            <button
                class="p-1 border border-transparent cursor-pointer transition-colors"
                @click="toggleFullscreen">
                <Maximize v-if="!isFullscreen" class="h-5 w-5 text-[#222]" />
                <Minimize v-else class="h-5 w-5 text-[#222]" />
            </button>

            <div class="relative avatar-box">
                <button
                    class="flex items-center justify-center p-1 border border-transparent cursor-pointer transition-colors"
                    @click="toggleMenu">
                    <CircleUserRound class="h-6 w-6 text-[#222]" />
                </button>

                <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0"
                    enter-to-class="opacity-100" leave-active-class="transition duration-75 ease-in"
                    leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <div v-if="showMenu"
                        class="absolute right-0 mt-1 w-64 border border-[#adadad] bg-white z-50 overflow-hidden">
                        <div class="flex items-center gap-3 p-3 relative">
                            <img src="https://i.pravatar.cc/100" alt="Avatar"
                                class="w-10 h-10 border border-[#d3d3d3]" />

                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-[#111] truncate">
                                    Nguyễn Văn A
                                </p>
                                <p class="text-xs text-gray-500 truncate">
                                    admin@gmail.com
                                </p>
                            </div>

                            <Button
                                variant="destructive"
                                @click="logout">
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </Transition>
            </div>

        </div>
    </header>
</template>