import request from "@/utils/request";

export function getFeedbackList(params, data) {
    let { page = 1, size = 10 } = params;
    return request({
        url: `/notice/list?page=${page}&size=${size}`,
        method: "post",
        data,
    });
}
export function addFeedback(data) {
    return request({
        url: `/notice/add`,
        method: "post",
        data,
    });
}

export function removeFeedback(params) {
    return request({
        url: `/notice/remove`,
        method: "get",
        params,
    });
}
export function showFeedback(params) {
    return request({
        url: `/notice/show`,
        method: "get",
        params,
    });
}