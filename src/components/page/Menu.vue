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
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-input v-model="pageInfo.condition.title" placeholder="菜单"
                          class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-s-tools" @click="handleReset">重置</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="菜单名称"></el-table-column>
                <el-table-column prop="index" label="菜单url"></el-table-column>
                <el-table-column prop="icon" label="菜单图标"></el-table-column>
                <el-table-column prop="parent" label="父级菜单" :formatter="parentFormatter"></el-table-column>

                <el-table-column prop="orderNum" label="排序号(数字越小，查询越靠前)"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormat"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
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

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
                <el-form-item label="菜单" prop="title">
                    <el-input v-model="addForm.title" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="index">
                    <el-input v-model="addForm.index" placeholder="请输入菜单路径（不用/开头）"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon">
                    <el-input v-model="addForm.icon" placeholder="请输入菜单图标"></el-input>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="addForm.orderNum" :min="1" :max="10" label="排序号"></el-input-number>
                    </template>
                </el-form-item>

                <el-form-item label="父级菜单" prop="pid">
                    <el-select v-model="addForm.pid" placeholder="请选择父级菜单">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="菜单" prop="title">
                    <el-input v-model="form.title" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="index">
                    <el-input v-model="form.index" placeholder="请输入菜单路径（不用/开头）"></el-input>
                </el-form-item>

                <el-form-item label="图标" prop="icon">
                    <el-input v-model="form.icon" placeholder="请输入菜单图标"></el-input>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="form.orderNum" :min="1" :max="10" label="排序号"></el-input-number>
                    </template>
                </el-form-item>
                <el-form-item v-if = "form.id != 0 "  label="父级菜单" prop="pid">
                    <el-select v-model="form.pid" placeholder="请选择父级菜单">
                        <el-option
                                v-for="item in editOptions"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import request from "../../utils/request";
    import {batchRemoveMenu, createMenu, getAllMenus, getMenusByPage, removeMenu, updateMenu} from "../../api/menu";
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
                        title: ''
                    }
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                addForm: {
                    orderNum: 3
                },
                addVisible: false,
                idx: -1,
                id: -1,
                title: "菜单管理",
                options: [],
                editOptions: [],
                rules: {
                    title: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    index: [
                        {required: true, message: '请输入菜单路径', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],

                    orderNum: [
                        {required: true, message: '请选择排序号', trigger: 'change'}
                    ],
                    pid: [
                        {required: false, message: '请选择父级菜单', trigger: 'change'}
                    ]

                }
            };
        },
        created() {
            this.getData();
            this.getOptions();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getOptions() {
                let graphQLParam = Utils.getGraphQLParam(getAllMenus);
                request.post(graphQLParam).then(data => {
                    this.options = data.getAllMenus;
                })
            },
            getData() {
                let variables = {};
                variables.pageInfo = this.pageInfo;
                let graphQLParam = Utils.getGraphQLParam(getMenusByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getMenusByPage;
                    this.tableData = res.records;
                    this.pageTotal = res.total;
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.pageInfo, 'pageNum', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let input = {
                        id: row.id
                    }
                    let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeMenu, input);
                    request.post(mutationGraphQLParam).then(data => {
                        this.getData();
                        this.$message.success('删除成功');
                    });
                }).catch(() => {
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                if (length > 0) {

                    this.$confirm(`您确定批量删除选择中${length}条记录吗？`, '提示', {
                        type: 'warning'
                    }).then(() => {
                        let str = '';
                        this.delList = this.delList.concat(this.multipleSelection);
                        let input = [];
                        this.delList.forEach(item => {
                            input.push({id: item.id});
                        });
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(batchRemoveMenu, input);
                        request.post(mutationGraphQLParam).then(data => {
                            for (let i = 0; i < length; i++) {
                                str += this.multipleSelection[i].title + ' ';
                            }
                            this.getData();
                            this.$message.success(`删除了${str}`);
                            this.multipleSelection = [];
                        });
                    });
                } else {
                    this.$message.warning("请选择想要删除的选项!");
                }

            },
            handleReset() {
                this.pageInfo.condition.title = "";
                this.getData();
            },
            handleAdd() {
                this.addVisible = true;
            },
            saveAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let addForm = this.addForm;
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(createMenu, addForm);
                        request.post(mutationGraphQLParam).then(data => {
                            this.addVisible = false;
                            this.$message.success(`添加成功`);
                            this.getData();
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
                // 处理父级菜单 , 不能包含自己
                let id = row.id;
                let options = this.options;
                this.editOptions = options.filter(item => item.id != id);

            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let input = {
                            id: this.form.id,
                            title: this.form.title,
                            orderNum: this.form.orderNum,
                            index: this.form.index,
                            icon : this.form.icon,
                            pid : this.form.pid
                        };
                        let graphQLParam = Utils.getMutationGraphQLParam(updateMenu, input);
                        request.post(graphQLParam).then(data => {
                            this.editVisible = false;
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.getData();
                        });
                    } else {
                        return false;
                    }
                });

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
            parentFormatter(row, column) {
                let parent = row.parent;
                if (parent) {
                    return parent.title;
                }
                return parent;
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
