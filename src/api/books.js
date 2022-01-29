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
export function getBorrwoList(params) {
    return request({
        url: `/books/borrowList`,
        method: "get",
        params,
    });
}
export function getReturnList(params) {
    return request({
        url: `/books/returnList`,
        method: "get",
        params,
    });
}
export function isPassBorrow(data) {
    return request({
        url: `/books/isPassBorrow`,
        method: "post",
        data,
    });
}
export function isPassReturn(data) {
    return request({
        url: `/books/isPassReturn`,
        method: "post",
        data,
    });
}