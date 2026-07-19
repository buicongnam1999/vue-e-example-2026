<template>
    <div class="h-full w-full">
        <BasicPage page-title="Quản Lý Người Dùng Hệ Thống" :is-loading="isLoading" @search="handleSearch"
            @reset="handleResetFilters" @export-excel="handleExportExcel" @add="isModalOpen = true">
            <template #filters>
                <TextField label="Họ và tên" v-model="filterForm.fullName" placeholder="Nhập họ tên"
                    :is-search="true" />
                <TextField label="Tài khoản" v-model="filterForm.username" placeholder="Nhập tài khoản"
                    :is-search="true" />
                <TextField label="Hộp thư" v-model="filterForm.email" placeholder="Nhập email" :is-search="true" />
            </template>

            <template #table>
                <Table :data="data?.list ?? []" :columns="tableColumns" use-can-mutation @choose="handleTableAction"
                    title="Danh Sách Người dùng" />
            </template>
        </BasicPage>

        <UserForm :is-open="isModalOpen" @close="isModalOpen = false" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/hooks/useFetch.ts'
import type { UserFormItem, UserItem } from '@/types/user.type'
import { ref } from 'vue'
import type { TableColumn } from '@/components/ui/Table.vue'
import Table from '@/components/ui/Table.vue'
import TextField from '@/components/ui/TextField.vue'
import BasicPage from '@/components/BasicPage.vue'
import UserForm from './UserForm.vue'

interface UserListData {
    list: UserItem[];
    total: number;
}

const tableColumns = ref<TableColumn[]>([
    { key: 'full_name', header: 'Họ và tên' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Số điện thoại' },
    { key: 'status', header: 'Trạng thái' }
])

const filterForm = ref({
    fullName: '',
    username: '',
    email: ''
})

const apiUrl = ref('/users')
const isModalOpen = ref(false)

const { data, isLoading, refetch } = useFetch<UserListData>({
    url: apiUrl.value,
    key: ['users'],
})

const handleSubmit = (user: UserFormItem) => {
    console.log("Dữ liệu gửi lên API chuẩn Zod:", user)
    isModalOpen.value = false
}

const handleSearch = () => {
    const params = new URLSearchParams()
    if (filterForm.value.fullName) params.append('full_name', filterForm.value.fullName)
    if (filterForm.value.username) params.append('username', filterForm.value.username)
    if (filterForm.value.email) params.append('email', filterForm.value.email)

    const queryString = params.toString()
    apiUrl.value = queryString ? `/users?${queryString}` : '/users'
}

const handleResetFilters = () => {
    filterForm.value = {
        fullName: '',
        username: '',
        email: ''
    }
    apiUrl.value = '/users'
}

const handleExportExcel = () => {
    console.log("Xuất dữ liệu hiện tại:", data.value?.list)
}

const handleTableAction = (item: UserItem, type: 'edit' | 'delete') => {
    console.log(`Hành động ${type} trên user:`, item)
}
</script>