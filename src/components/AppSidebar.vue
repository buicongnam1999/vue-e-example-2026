<script setup lang="ts">
import { computed, ref } from 'vue'
import { routes } from '@/router/routes'
import SidebarItem from './SidebarItem.vue'
import type { RouteRecordRaw } from 'vue-router'
import { buildSidebarMenus } from '@/router/sidebar.ts'
import type { SidebarMenu } from '@/types/sidebar'
import { ArrowLeftToLine, ArrowRightToLine, ChevronLeft, ChevronsLeft, ChevronsRight, Star } from 'lucide-vue-next'

const collapsed = ref(false);

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
};

const appRoute = routes.find(r => r.path === '/') as RouteRecordRaw

const menus = computed(() => {
    return buildSidebarMenus(appRoute?.children ?? [])
})

const extractFavorites = (menuList: SidebarMenu[]): SidebarMenu[] => {
    let favs: SidebarMenu[] = []

    for (const menu of menuList) {
        if (menu.meta?.favorite === true) {
            favs.push(menu)
        }
        if (menu.children && menu.children.length > 0) {
            favs = favs.concat(extractFavorites(menu.children))
        }
    }

    return favs
}

const favoriteMenus = computed(() => {
    return extractFavorites(menus.value)
})
</script>

<template>
    <aside
        class="h-full border-r border-[#adadad] bg-[#f0f0f0] flex flex-col select-none font-sans text-[13px] text-black shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        :class="collapsed ? 'w-10' : 'w-64'">
        <template v-if="!collapsed">
            <div class="w-full flex justify-end p-2" @click="toggleSidebar">
                <div class="text-gray-500 cursor-pointer">
                    <ArrowLeftToLine :size="20" />
                </div>
            </div>

            <div v-if="favoriteMenus.length > 0"
                class="shrink-0 flex flex-col border-b border-[#adadad] pb-2">
                <div
                    class="px-3 py-1.5 text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Star :size="18" fill="gold" color="gold" /> Menu yêu thích
                </div>

                <SidebarItem v-for="menu in favoriteMenus" :key="'fav-' + menu.path" :route="menu" />
            </div>

            <div class="flex-1 overflow-y-auto min-h-0 pt-1">
                <SidebarItem v-for="menu in menus" :key="menu.name || menu.path || ''" :route="menu" />
            </div>
        </template>

        <template v-else>
            <div class="w-full flex justify-center pt-2 cursor-pointer text-gray-500" @click="toggleSidebar">
                <ChevronsRight :size="20" />
            </div>
        </template>
    </aside>
</template>