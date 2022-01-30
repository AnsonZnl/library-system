import request from "@/utils/request";

export function getFeedbackList(params, data) {
    let { page = 1, size = 10 } = params;
    return request({
        url: `/feedback/list?page=${page}&size=${size}`,
        method: "post",
        data,
    });
}
export function addFeedback(data) {
    return request({
        url: `/feedback/add`,
        method: "post",
        data,
    });
}


export function removeFeedback(params) {
    return request({
        url: `/feedback/remove`,
        method: "get",
        params,
    });
}