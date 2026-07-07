<script setup lang="ts">
import { computed, ref } from 'vue'
import { routes } from '@/router/routes'
import SidebarItem from './SidebarItem.vue'
import type { RouteRecordRaw } from 'vue-router'
import { buildSidebarMenus } from '@/router/sidebar.ts'
import type { SidebarMenu } from '@/types/sidebar'
import { ArrowLeftToLine, ChevronsRight, Star } from 'lucide-vue-next'

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
        class="h-full border-r border-zinc-200 bg-zinc-100 flex flex-col select-none font-sans text-[13px] text-zinc-700 shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        :class="collapsed ? 'w-12' : 'w-64'">

        <template v-if="!collapsed">
            <div class="w-full flex justify-end p-2.5 shrink-0">
                <button @click="toggleSidebar"
                    class="p-1.5 hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-900 rounded-md transition-all duration-200">
                    <ArrowLeftToLine :size="16" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto min-h-0 px-2 pb-4 custom-scrollbar">

                <div v-if="favoriteMenus.length > 0" class="flex flex-col pb-4 border-b border-zinc-200">
                    <div class="px-2 py-1.5 text-sm font-semibold text-zinc-400 uppercase flex items-center gap-2">
                        <Star :size="13" class="text-amber-400 fill-amber-400" />
                        <span>Menu yêu thích</span>
                    </div>

                    <div class="flex flex-col">
                        <template v-for="(menu, index) in favoriteMenus" :key="'fav-' + menu.path">
                            <div class="py-0.5">
                                <SidebarItem :route="menu" />
                            </div>
                            <div v-if="index < favoriteMenus.length - 1" class="h-[1px] bg-zinc-200 mx-4 my-0.5"></div>
                        </template>
                    </div>
                </div>

                <div class="flex flex-col pt-4">
                    <div class="px-2 py-1.5 text-sm font-semibold text-zinc-400 uppercase">
                        <span>Danh mục chính</span>
                    </div>

                    <div class="flex flex-col">
                        <template v-for="(menu, index) in menus" :key="menu.name || menu.path || ''">
                            <div class="py-0.5">
                                <SidebarItem :route="menu" />
                            </div>
                            <div v-if="index < menus.length - 1" class="h-[1px] bg-zinc-200/70 mx-4 my-0.5"></div>
                        </template>
                    </div>
                </div>

            </div>
        </template>

        <template v-else>
            <div class="w-full flex flex-col items-center pt-3">
                <button @click="toggleSidebar"
                    class="p-1.5 hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-900 rounded-md transition-all duration-200">
                    <ChevronsRight :size="16" />
                </button>
            </div>
        </template>
    </aside>
</template>