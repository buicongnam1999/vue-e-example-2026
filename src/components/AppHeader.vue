<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import {
    Minimize,
    Maximize,
    HelpCircle,
    CircleUserRound,
    ExternalLink
} from "lucide-vue-next";
import { routes } from "@/router/routes";
import BaseConfirmModal from "./BaseConfirmModal.vue";

interface MenuItem {
    label: string;
    href?: string;
    isExternal?: boolean;
    disabled?: boolean;
    action?: () => void;
}

const route = useRoute();
const showUserMenu = ref(false);
const showHelpMenu = ref(false);
const isFullscreen = ref(false);

const showLogoutConfirm = ref(false);

const headerMenus = routes[0]?.children?.filter(r => r.meta && r.meta.title) || [];

const isMenuActive = (menu: any) => {
    if (menu.path === '') {
        return route.path === '/';
    }
    return route.path.startsWith(`/${menu.path}`);
};

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
    if (showUserMenu.value) showHelpMenu.value = false;
};

const toggleHelpMenu = () => {
    showHelpMenu.value = !showHelpMenu.value;
    if (showHelpMenu.value) showUserMenu.value = false;
};

const handleRequestLogout = () => {
    showUserMenu.value = false;
    showLogoutConfirm.value = true;
};

const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
};

const userMenuItems: MenuItem[] = [
    { label: "Multi-Dashboard", href: "#", isExternal: true, disabled: true },
    { label: "Privacy Policy", href: "#", isExternal: true },
    { label: "Service Setting", href: "#" },
    { label: "Personal Setting", href: "#" },
    { label: "Logout", action: handleRequestLogout } // Thay đổi hành động từ logout sang kích hoạt mở modal
];

const helpMenuItems: MenuItem[] = [
    { label: "FAQ", href: "#" },
    { label: "Terms", href: "#" },
    { label: "User Guide", href: "#", isExternal: true }
];

const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest(".avatar-box")) {
        showUserMenu.value = false;
    }
    if (!target.closest(".help-box")) {
        showHelpMenu.value = false;
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
    <header
        class="relative flex h-[60px] items-center justify-between bg-[var(--color-primary-900)] px-[40px] select-none font-sans text-white">

        <div class="font-bold text-white text-base z-10">
            Logo
        </div>

        <nav class="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8 hidden md:flex">
            <router-link v-for="menu in headerMenus" :key="menu.name || menu.path"
                :to="menu.path === '' ? '/' : `/${menu.path}`" :class="[
                    'text-base font-medium transition-all duration-200 hover:text-white pb-1',
                    isMenuActive(menu)
                        ? 'text-white font-semibold border-white'
                        : 'text-white/70 border-transparent hover:border-white/40'
                ]">
                {{ menu.meta?.title }}
            </router-link>
        </nav>

        <div class="flex items-center gap-4 z-10">

            <button class="p-1 cursor-pointer text-secondary-500 hover:text-white transition-colors"
                @click="toggleFullscreen" title="Toggle Fullscreen">
                <Maximize v-if="!isFullscreen" class="h-6 w-6" />
                <Minimize v-else class="h-6 w-6" />
            </button>

            <div class="relative help-box">
                <button @click="toggleHelpMenu"
                    class="p-1 cursor-pointer text-secondary-500 hover:text-white transition-colors focus:outline-none">
                    <HelpCircle class="h-6 w-6" />
                </button>

                <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-75 ease-in"
                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="showHelpMenu"
                        class="absolute right-0 mt-2 w-48 rounded-md border border-[var(--color-secondary-400)] bg-white shadow-lg z-50 overflow-hidden py-1 text-left">
                        <template v-for="(item, index) in helpMenuItems" :key="index">
                            <component :is="item.disabled ? 'span' : 'a'" :href="item.disabled ? undefined : item.href"
                                @click="item.action ? item.action() : null" :class="[
                                    'flex items-center justify-between px-4 py-2.5 text-[15px] font-normal transition-colors',
                                    item.disabled
                                        ? 'text-secondary-500 cursor-not-allowed opacity-60'
                                        : 'text-primary-800 hover:bg-[var(--color-primary-50)] cursor-pointer'
                                ]">
                                <span>{{ item.label }}</span>
                                <ExternalLink v-if="item.isExternal" class="h-4 w-4 text-current" />
                            </component>
                        </template>
                    </div>
                </Transition>
            </div>

            <div class="relative avatar-box">
                <button
                    class="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-secondary-300)] text-white cursor-pointer hover:opacity-90 transition-opacity focus:outline-none"
                    @click="toggleUserMenu">
                    <CircleUserRound class="h-7 w-7" />
                </button>

                <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-75 ease-in"
                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="showUserMenu"
                        class="absolute right-0 mt-2 w-56 rounded-md border border-[var(--color-secondary-400)] bg-white shadow-lg z-50 overflow-hidden py-1 text-left">
                        <template v-for="(item, index) in userMenuItems" :key="index">
                            <div v-if="index === 1" class="border-t border-[var(--color-secondary-400)] my-1"></div>

                            <component :is="item.disabled ? 'span' : 'a'" :href="item.disabled ? undefined : item.href"
                                @click="item.action ? item.action() : null" :class="[
                                    'flex items-center justify-between px-4 py-2.5 text-[15px] font-normal transition-colors',
                                    item.disabled
                                        ? 'text-secondary-500 cursor-not-allowed opacity-60'
                                        : 'text-primary-800 hover:bg-[var(--color-primary-50)] cursor-pointer'
                                ]">
                                <span>{{ item.label }}</span>
                                <ExternalLink v-if="item.isExternal" class="h-4 w-4 text-current" />
                            </component>
                        </template>
                    </div>
                </Transition>
            </div>

        </div>
    </header>

    <BaseConfirmModal v-model="showLogoutConfirm" title="Are you sure you want to log out?" cancel-text="Cancel"
        confirm-text="Confirm" @confirm="logout" />
</template>