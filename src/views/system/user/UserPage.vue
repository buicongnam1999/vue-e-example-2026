<template>
    <div class="h-full w-full">
        <BasicPage page-title="Quản Lý Người Dùng Hệ Thống" :is-loading="isLoading" @search="handleSearch"
            @reset="handleResetFilters" @export-excel="handleExportExcel">
            <template #filters>
                <TextFeild label="Họ và tên" v-model="filterForm.fullName" />
                <TextFeild label="Tài khoản" v-model="filterForm.username" />
                <TextFeild label="Hộp thư" v-model="filterForm.email" />
            </template>

            <template #table>
                <AppTable :data="data?.list ?? []" :columns="tableColumns" use-can-mutation
                    @choose="handleTableAction" />
            </template>
        </BasicPage>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@/components/AppTable.vue'
import AppTable from '@/components/AppTable.vue'
import BasicPage from '@/components/BasicPage.vue'
import TextFeild from '@/components/TextFeild.vue'
import { useFetch } from '@/hooks/useFetch.ts'
import type { UserItem } from '@/types/user.type'
import { ref } from 'vue'

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

const { data, isLoading } = useFetch<UserListData>({
    url: apiUrl.value,
    key: ['users'],
})

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