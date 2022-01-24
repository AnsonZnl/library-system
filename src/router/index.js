import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: "/login",
        component: () =>
            import ("@/views/login/index"),
        hidden: true,
    },

    {
        path: "/404",
        component: () =>
            import ("@/views/404"),
        hidden: true,
    },

    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [{
            path: "dashboard",
            name: "Dashboard",
            component: () =>
                import ("@/views/dashboard/index"),
            meta: { title: "首页", icon: "dashboard" },
        }, ],
    },

    {
        path: "/books",
        component: Layout,
        children: [{
            path: "index",
            name: "Books",
            component: () =>
                import ("@/views/books/index"),
            meta: {
                title: "图书管理",
                icon: "el-icon-notebook-2",
            },
        }, ],
    },

    {
        path: "/borrow",
        component: Layout,
        redirect: "/borrow/borrow",
        name: "Borrow",
        meta: {
            title: "借还管理",
            icon: "el-icon-document",
        },
        children: [{
                path: "borrow",
                name: "Borrow",
                component: () =>
                    import ("@/views/borrow/index"),
                meta: { title: "借书管理", icon: "" },
            },
            {
                path: "return",
                name: "Return",
                component: () =>
                    import ("@/views/return/index"),
                meta: { title: "还书管理", icon: "" },
            },
        ],
    },

    {
        path: "/students",
        component: Layout,
        children: [{
            path: "students",
            name: "students",
            component: () =>
                import ("@/views/students/index"),
            meta: {
                title: "学生管理",
                icon: "el-icon-user-solid",
            },
        }, ],
    },

    {
        path: "/feedback",
        component: Layout,
        children: [{
            path: "feedback",
            name: "Feedback",
            component: () =>
                import ("@/views/feedback/index"),
            meta: {
                title: "留言管理",
                icon: "el-icon-edit-outline",
            },
        }, ],
    },

    {
        path: "/notice",
        component: Layout,
        children: [{
            path: "notice",
            name: "Notice",
            component: () =>
                import ("@/views/notice/index"),
            meta: {
                title: "公告管理",
                icon: "el-icon-reading",
            },
        }, ],
    },

    // 404 page must be placed at the end !!!
    { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes,
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;