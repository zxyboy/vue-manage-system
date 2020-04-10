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
                <el-input v-model="pageInfo.condition.courseName" placeholder="科目"
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
                <el-table-column prop="courseName" label="科目"></el-table-column>
                <el-table-column prop="courseDesc" label="科目描述"></el-table-column>

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
            <el-form ref="addForm" :rules="rules" :model="addForm" label-width="70px">
                <el-form-item label="科目" prop="courseName">
                    <el-input v-model="addForm.courseName" placeholder="请输入科目名称"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="courseDesc">
                    <el-input v-model="addForm.courseDesc" placeholder="请输入科目描述"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="addForm.orderNum" :min="1" :max="5" label="排序号"></el-input-number>
                    </template>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :rules="rules" :model="form" label-width="70px">
                <el-form-item label="科目" prop="courseName">
                    <el-input v-model="form.courseName" placeholder="请输入科目名称"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="courseDesc">
                    <el-input v-model="form.courseDesc" placeholder="请输入科目描述"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="form.orderNum" :min="1" :max="5" label="排序号"></el-input-number>
                    </template>
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
    import {batchRemoveCourse, createCourse, getCoursesByPage, removeCourse, updateCourse} from "../../api/course";
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
                        courseName: ''
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
                title: "科目管理",
                rules: {
                    courseName: [
                        {required: true, message: '请输入科目名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    courseDesc: [
                        {required: true, message: '请输入科目描述', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请选择排序号', trigger: 'change'}
                    ]
                }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                let variables = {};
                variables.pageInfo = this.pageInfo;
                let graphQLParam = Utils.getGraphQLParam(getCoursesByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getCoursesByPage;
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
                    let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeCourse, input);
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
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(batchRemoveCourse, input);
                        request.post(mutationGraphQLParam).then(data => {
                            for (let i = 0; i < length; i++) {
                                str += this.multipleSelection[i].courseName + ' ';
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
                this.pageInfo.condition.courseName = "";
                this.getData();
            },
            handleAdd() {
                this.addVisible = true;
            },
            saveAdd(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let addForm = this.addForm;
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(createCourse, addForm);
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
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let input = {
                            id: this.form.id,
                            courseName: this.form.courseName,
                            orderNum: this.form.orderNum,
                            courseDesc: this.form.courseDesc
                        };
                        let graphQLParam = Utils.getMutationGraphQLParam(updateCourse, input);
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
