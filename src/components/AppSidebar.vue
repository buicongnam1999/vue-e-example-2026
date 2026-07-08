<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/routes'
import SidebarItem from './SidebarItem.vue'
import type { RouteRecordRaw } from 'vue-router'
import { buildSidebarMenus } from '@/router/sidebar.ts'
import type { SidebarMenu } from '@/types/sidebar'
import { ArrowLeftToLine, ChevronsRight, Star } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)

const toggleSidebar = () => {
    collapsed.value = !collapsed.value
}

const appRoute = routes.find(r => r.path === '/') as RouteRecordRaw

const mapAbsolutePaths = (menuList: SidebarMenu[]): SidebarMenu[] => {
    return menuList.map(item => {
        let absolutePath = item.path

        if (item.name) {
            try {
                const resolved = router.resolve({ name: item.name })
                if (resolved && resolved.href !== '/') {
                    absolutePath = resolved.path
                }
            } catch (e) {
                console.warn(`Không resolve được route name: ${String(item.name)}`, e)
            }
        }

        let newChildren: SidebarMenu[] = []
        if (item.children && item.children.length > 0) {
            newChildren = mapAbsolutePaths(item.children)
        }

        return {
            ...item,
            path: absolutePath,
            children: newChildren
        }
    })
}

const menus = computed(() => {
    const children = appRoute?.children ?? []

    const activeLevel1 = children.find(r => r.path !== '' && route.path.startsWith(`/${r.path}`))

    if (activeLevel1 && activeLevel1.children) {
        const rawMenus = buildSidebarMenus(activeLevel1.children)

        return mapAbsolutePaths(rawMenus)
    }

    return []
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
        class="h-full bg-secondary-300 flex flex-col select-none font-sans text-[17px] text-secondary-800 shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        :class="collapsed ? 'w-12' : 'w-64'">

        <template v-if="!collapsed">
            <div class="w-full flex justify-end p-2.5 shrink-0">
                <button @click="toggleSidebar"
                    class="p-1.5 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 rounded-md transition-all duration-200 cursor-pointer">
                    <ArrowLeftToLine :size="18" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto min-h-0 px-2 pb-4 custom-scrollbar">

                <!-- MENU YÊU THÍCH -->
                <div v-if="favoriteMenus.length > 0" class="flex flex-col pb-4">
                    <div
                        class="px-2 py-1.5 text-[15px] font-bold text-secondary-700 uppercase flex items-center gap-2 tracking-wider">
                        <Star :size="16" class="text-amber-400 fill-amber-400" />
                        <span>Menu yêu thích</span>
                    </div>

                    <div class="flex flex-col">
                        <template v-for="menu in favoriteMenus" :key="'fav-' + menu.path">
                            <div class="py-0.5">
                                <SidebarItem :route="menu" />
                            </div>
                        </template>
                    </div>
                </div>

                <!-- DANH MỤC CHÍNH -->
                <div v-if="menus.length > 0" class="flex flex-col pt-2">
                    <div class="px-2 py-1.5 text-[15px] font-bold text-secondary-700 uppercase tracking-wider">
                        <span>Danh mục chính</span>
                    </div>

                    <div class="flex flex-col">
                        <template v-for="menu in menus" :key="menu.name || menu.path || ''">
                            <div class="py-0.5">
                                <SidebarItem :route="menu" />
                            </div>
                        </template>
                    </div>
                </div>

                <div v-else class="text-center pt-8 text-secondary-500 text-sm italic">
                    Không có danh mục con
                </div>

            </div>
        </template>

        <template v-else>
            <div class="w-full flex flex-col items-center pt-3">
                <button @click="toggleSidebar"
                    class="p-1.5 hover:bg-secondary-200 text-secondary-600 hover:text-secondary-900 rounded-md transition-all duration-200 cursor-pointer">
                    <ChevronsRight :size="18" />
                </button>
            </div>
        </template>
    </aside>
</template>