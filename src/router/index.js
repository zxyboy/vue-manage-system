import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: {title: '系统首页'}
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: {title: '自定义图标'}
                },

                {
                    path: '/semester',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Semester.vue'),
                    meta: {title: '学期维护'}
                },
                {
                    path: '/grade',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Grade.vue'),
                    meta: {title: '年级维护'}
                },
                {
                    path: '/course',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Course.vue'),
                    meta: {title: '科目维护'}
                },
                {
                    path: '/chapter',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Chapter.vue'),
                    meta: {title: '单元维护'}
                },


                {
                    path: '/question-maintain',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/QuestionItem.vue'),
                    meta: {title: '题库维护'}
                },


                {
                    path: '/question-type',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/QuestionType.vue'),
                    meta: {title: '试题类型'}
                },


                {
                    path: '/paper-manager',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Paper.vue'),
                    meta: {title: '试卷管理'}
                },

                {
                    // vue-schart组件
                    path: '/user-stat',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: {title: '用户统计'}
                },

                {
                    // vue-schart组件
                    path: '/user-stat',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: {title: '用户统计'}
                },
                {
                    // vue-schart组件
                    path: '/paper-stat',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: {title: '试卷统计'}
                },


                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/User.vue'),
                    meta: {title: '用户管理'}
                },

                {
                    path: '/menu',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Menu.vue'),
                    meta: {title: '菜单管理'}
                },

                {
                    path: '/role',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Role.vue'),
                    meta: {title: '角色管理'}
                },

                {
                    path: '/userInfo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/UserInfo.vue'),
                    meta: {title: '用户信息'}
                },
                {
                    path: '/editPassword',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/EditPassword.vue'),
                    meta: {title: '修改密码'}
                },


                // TODO 华丽的分割线--------------------
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: {title: 'tab选项卡'}
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: {title: '富文本编辑器'}
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: {title: 'markdown编辑器'}
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: {title: '文件上传'}
                },

                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: {title: '拖拽列表'}
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: {title: '拖拽弹框'}
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: {title: '国际化'}
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: {title: '权限测试', permission: true}
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: {title: '404'}
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: {title: '403'}
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: {title: '支持作者'}
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: {title: '登录'}
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
