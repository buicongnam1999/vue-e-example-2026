<script setup lang="ts">
import AppTable, { type TableColumn } from '@/components/AppTable.vue';
import Button from '@/components/Button.vue';
import Checkbox from '@/components/Checkbox.vue';
import CodeView from '@/components/CodeView.vue';
import SegmentLoader from '@/components/SegmentLoader.vue';
import Select from '@/components/Select.vue';
import TextFeild from '@/components/TextFeild.vue';
import type { OptionItem } from '@/types/option';
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';

interface UserItem {
    id: number
    username: string
    email: string
    status: boolean
}

const tableHeaders = ref<TableColumn[]>([
    { key: 'username', header: 'Tên tài khoản' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Trạng thái' },
])

const userList = ref<UserItem[]>([
    { id: 11, username: 'npp_admin', email: 'admin@notepad.com', status: true },
    { id: 12, username: 'vue_master', email: 'vue3@notepad.com', status: false },
])

const handleTableAction = (data: UserItem, type: 'edit' | 'delete') => {
    console.log(`Hành động: ${type} trên item:`, data)
}

const pluginOptions = ref<OptionItem[]>([
    { label: 'JSON Viewer Plugin', value: 'json_viewer' },
    { label: 'Compare Tool v2.0', value: 'compare_tool' },
    { label: 'MIME Tools', value: 'mime_tools' },
    { label: 'Python Script Host', value: 'python_script' },
    { label: 'XML Tools Pack', value: 'xml_tools' }
])
const pluginOption = ref<string[]>(['json_viewer'])

const langnOptions = ref<OptionItem[]>([
    { label: 'JSON Viewer Plugin', value: 'json_viewer' },
    { label: 'Compare Tool v2.0', value: 'compare_tool' },
    { label: 'MIME Tools', value: 'mime_tools' },
    { label: 'Python Script Host', value: 'python_script' },
    { label: 'XML Tools Pack', value: 'xml_tools' }
])
const langOption = ref<string[]>(['json_viewer'])

const onSelect = () => {

}

</script>

<template>
    <div class="h-screen overflow-y-auto">
        <div class="text-xl">
            Example Component
        </div>

        <div class="flex gap-5">
            <div>
                <div class="mt-5">
                    <div class="text-xl mb-2 text-red-600">Text Field</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <TextFeild label="Text" />
                        <TextFeild label="Number" type="number" />
                    </div>
                </div>

                <div class="mt-5">
                    <div class="text-xl text-red-600 mt-5">Button</div>
                    <div class="w-100 flex gap-2 overflow-y-auto">
                        <Button>Default</Button>
                        <Button :disabled="true">Disable</Button>
                        <Button variant="primary">Primary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="primary":icon="Search">
                            Search
                        </Button>
                    </div>
                </div>
                <div class="mt-5">
                    <div class="text-xl text-red-600 mt-5 mb-2">CodeView</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <CodeView title="List Codeview" label="Codeview" url="/users" value-field="full_name"
                            description-field="phone" @select="onSelect" />
                    </div>
                </div>
                <div class="mt-5">
                    <div class="text-xl text-red-600 mt-5 mb-2">Checkbox</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <Checkbox label="Checkbox" />
                    </div>
                </div>
                <div class="mt-5">
                    <div class="text-xl text-red-600 mt-5 mb-2">Select</div>
                    <div class="w-100 flex flex-1 flex-col gap-2">
                        <Select v-model="pluginOption" :items="pluginOptions" label="Ngôn ngữ" required
                            error="Vui lòng chọn ít nhất một ngôn ngữ" placeholder="--- Chọn ngôn ngữ ---" />
                        <Select v-model="pluginOption" :items="pluginOptions" label="Ngôn ngữ"
                            placeholder="--- Chọn ngôn ngữ ---" />
                        <Select v-model="langOption" :items="langnOptions" label="Ngôn ngữ" multiple required
                            error="Vui lòng chọn ít nhất một ngôn ngữ" />
                        <Select v-model="langOption" :items="langnOptions" label="Ngôn ngữ" />
                    </div>
                </div>
                <div class="mt-5">
                    <div class="text-xl text-red-600 mt-5 mb-2">Loading</div>
                    <div class="w-100 flex flex-1 flex-col gap-2 overflow-y-auto">
                        <SegmentLoader />
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <div class="text-xl text-red-600 mt-5 mb-2">Table</div>
                <div class="w-full">
                    <AppTable title="Danh Sách Tài Khoản" :data="userList" :columns="tableHeaders" use-can-mutation
                        @choose="handleTableAction">
                        <template #col-status="{ value }">
                            <span :class="[
                                'px-2 py-0.5 rounded text-xs font-medium',
                                value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            ]">
                                {{ value ? 'Hoạt động' : 'Khóa' }}
                            </span>
                        </template>

                        <template>
                            <div class="text-xs text-gray-400 text-right">
                                Tổng số: {{ userList.length }} bản ghi
                            </div>
                        </template>
                    </AppTable>
                </div>
            </div>
        </div>
    </div>
</template>