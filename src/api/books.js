import request from "@/utils/request";

export function getList(query, params) {
    let { page = 1, size = 10 } = query
    return request({
        url: `/books/query?page=${page}&size=${size}`,
        method: "post",
        params,
    });
}