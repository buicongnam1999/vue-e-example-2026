import { api } from "@/api/axios";
import { useQuery, type UseQueryOptions } from "@tanstack/vue-query";

export interface DataResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: unknown;
}

class ApiError extends Error {
    errors?: unknown;

    constructor(message: string, errors?: unknown) {
        super(message);
        this.name = "ApiError";
        this.errors = errors;
    }
}

export const useFetch = <
    TQueryFnData,
    TData = TQueryFnData
>({
    url,
    key,
    options,
}: {
    url: string;
    key: string[];
    options?: Omit<
        UseQueryOptions<TQueryFnData, ApiError, TData>,
        "queryKey" | "queryFn"
    >;
}) => {
    const fetchAPI = async (): Promise<TQueryFnData> => {
        const response = await api.get<DataResponse<TQueryFnData>>(url);

        const res = response.data;

        if (res.success) {
            return res.data as TQueryFnData;
        }

        throw new ApiError(res.message || "Request failed", res.errors);
    };

    return useQuery<TQueryFnData, ApiError, TData>({
        queryKey: key,
        queryFn: fetchAPI,

        refetchOnWindowFocus: false,
        enabled: true,

        ...options,
    });
};