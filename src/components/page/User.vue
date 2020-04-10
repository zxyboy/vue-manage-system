<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> {{title}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                年级：

                <el-select v-model="pageInfo.condition.gradeId" placeholder="请选择年级">
                    <el-option
                            v-for="grade in allGrades"
                            :key="grade.id"
                            :label="grade.grade"
                            :value="grade.id">
                    </el-option>
                </el-select>

                用户昵称:
                <el-input v-model="pageInfo.condition.nickname" placeholder="请输入用户昵称"
                          class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-s-tools" @click="handleReset">重置</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称">
                    <template slot-scope="scope">
                        {{ scope.row.nickname ? scope.row.nickname : scope.row.username}}
                    </template>
                </el-table-column>
                <el-table-column prop="gender" label="性别" :formatter="genderFormatter"></el-table-column>
                <el-table-column label="微信头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.avatarUrl"
                                :preview-src-list="[scope.row.avatarUrl]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="birthday" label="生日"></el-table-column>
                <el-table-column prop="grade.grade" label="年级"></el-table-column>
                <el-table-column prop="roles" label="角色" :formatter="roleFormatter"></el-table-column>

                <el-table-column prop="parents" label="监护人" :formatter="parentFormatter"></el-table-column>
                <el-table-column prop="children" label="孩子" :formatter="childrenFormatter"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormat"></el-table-column>
                <el-table-column prop="lastLoginTime" label="最后登录时间" :formatter="lastTimeFormat"></el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="pageInfo.pageNum"
                        :page-size="pageInfo.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import request from "../../utils/request";
    import {getAllGrades, getUsersByPage} from "../../api/user";
    import globalConfig from "../../api/config/global_configuration";
    import Utils from "../../utils/utils";

    export default {
        name: 'basetable',
        data() {
            return {
                pageInfo: {
                    pageNum: 1,
                    pageSize: globalConfig.defaultPageSize,
                    condition: {
                        nickname: '',
                        gradeId: ''
                    }
                },
                tableData: [],
                allGrades: [],
                value: '',
                pageTotal: 0,
                title: "用户管理"

            };
        },
        created() {
            this.getData();
            this.getAllGrades();
        },
        methods: {
            getAllGrades() {
                let graphQLParam = Utils.getGraphQLParam(getAllGrades);
                request.post(graphQLParam).then(data => {
                    this.allGrades = data.getAllGrades;
                });
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let variables = {};
                let gradeId = this.pageInfo.condition.gradeId;
                if (!gradeId) {
                    let deepClone = Utils.deepClone(this.pageInfo);
                    deepClone.condition.gradeId = 0;
                    variables.pageInfo = deepClone;
                } else {
                    variables.pageInfo = this.pageInfo;
                }
                let graphQLParam = Utils.getGraphQLParam(getUsersByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getUsersByPage;
                    this.tableData = res.records;
                    this.pageTotal = res.total;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.pageInfo, 'pageNum', 1);
                this.getData();
            },
            handleReset() {
                this.pageInfo.condition.nickname = "";
                this.pageInfo.condition.gradeId = "";
                this.getData();
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.pageInfo, 'pageNum', val);
                this.getData();
            },

            // 创建时间格式化
            timeFormat(row, column) {
                return Utils.strToDateStr(new Date(row.createTime));
            },
            lastTimeFormat(row, column) {
                return Utils.strToDateStr(new Date(row.lastLoginTime));
            },
            genderFormatter(row, column) {
                let gender = row.gender;
                if (gender) {
                    switch (gender) {
                        case '1' :
                            gender = '男';
                            break;
                        case '2' :
                            gender = '女';
                            break
                        default:
                            gender = '未知';
                            break;
                    }
                } else {
                    gender = '未知';
                }
                return gender;
            },
            roleFormatter(row, column) {
                let roles = row.roles;
                if (roles && roles.length > 0) {
                    let role = roles.map(item => item.roleName).join(",");
                    return role;
                }
                return roles;
            },
            childrenFormatter(row, column) {
                let children = row.children;
                if (children && children.length > 0) {
                    let child = children.map(item => item.nickname).join(",");
                    return child;
                }
                return children;
            },
            parentFormatter(row, column) {
                let parents = row.parents;
                if (parents && parents.length > 0) {
                    let parent = parents.map(item => item.nickname).join(",");
                    return parent;
                }
                return parents;
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
