import request from "@/utils/request";

export function getList(params, data) {
    let { page = 1, size = 10 } = params;
    return request({
        url: `/books/query?page=${page}&size=${size}`,
        method: "post",
        data,
    });
}
export function addBook(data) {
    return request({
        url: `/books/add`,
        method: "post",
        data,
    });
}
export function editBook(data) {
    return request({
        url: `/books/update`,
        method: "post",
        data,
    });
}

export function removeBook(params) {
    return request({
        url: `/books/remove`,
        method: "get",
        params,
    });
}
export function getDouBookInfo(params) {
    return request({
        url: `/books/addDouBookInfo`,
        method: "get",
        params,
    });
}

;