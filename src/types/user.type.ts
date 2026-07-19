export interface UserAccount {
    id: number;
    username: string;
    failed_attempts: number;
    locked_until: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserItem {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    role: 'admin' | 'user' | 'librarian' | string;
    status: 'active' | 'inactive' | string;
    lang: 'vi' | 'en' | string;
    created_at: string;
    updated_at: string;
    avatar_path: string | null;
    user_code: string | null;
    address: string | null;
    accounts: UserAccount | null;
}

export interface UserFormItem {
    full_name: string;
    email: string;
    phone: string;
    role: string;
    lang: string;
}