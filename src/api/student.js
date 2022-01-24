import request from "@/utils/request";

export function getList(params, data) {
    let { page = 1, size = 10 } = params;
    return request({
        url: `/student/list?page=${page}&size=${size}`,
        method: "post",
        data,
    });
}
export function addStudent(data) {
    return request({
        url: `/student/register`,
        method: "post",
        data,
    });
}
export function studentInfo(params) {
    return request({
        url: `/student/info`,
        method: "get",
        params,
    });
}

export function removeStudent(params) {
    return request({
        url: `/student/remove`,
        method: "get",
        params,
    });
}