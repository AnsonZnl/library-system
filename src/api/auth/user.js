import request from "@/utils/request";

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
    return request({
        url: "/user/login",
        method: "post",
        data: parameter,
    });
}

export function logout() {
    return request({
        url: "/user/logout",
        method: "post",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
    });
}

export function getInfo() {
    return request({
        url: "/user/info",
        method: "get",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
    });
}