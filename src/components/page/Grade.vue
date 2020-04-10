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
                <el-input v-model="pageInfo.condition.grade" placeholder="年级"
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
                <el-table-column prop="grade" label="年级"></el-table-column>
                <el-table-column prop="courseDesc" label="科目" :formatter="courseFormatter"></el-table-column>

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
        <el-dialog title="新增" :visible.sync="addVisible" width="50%" @closed="clearCourse">
            <el-form ref="addForm" :rules="rules" :model="addForm" label-width="70px">
                <el-form-item label="年级" prop="grade">
                    <el-input v-model="addForm.grade" placeholder="请输入年级名称"></el-input>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="addForm.orderNum" :min="1" :max="5" label="排序号"></el-input-number>
                    </template>
                </el-form-item>

                <el-form-item label="科目" prop="courses">
                    <template>
                        <section class="main">
                            <div class="container">
                                <div class="drag-box">
                                    <div class="drag-box-item">
                                        <div class="item-title">全部科目</div>
                                        <draggable v-model="courses" @remove="removeHandle" :options="dragOptions">
                                            <transition-group tag="div" id="todo-1" class="item-ul">
                                                <div v-for="item in courses" class="drag-list" :key="item.id">
                                                    {{item.courseName + '(' + item.courseDesc + ')'}}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                    <div class="drag-box-item">
                                        <div class="item-title">已选科目</div>
                                        <draggable v-model="choosedCourses" @remove="removeHandle"
                                                   :options="dragOptions">
                                            <transition-group tag="div" id="doing-1" class="item-ul">
                                                <div v-for="item in choosedCourses" class="drag-list" :key="item.id">
                                                    {{item.courseName + '(' + item.courseDesc + ')'}}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </template>
                </el-form-item>


            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%" @closed="clearCourse">
            <el-form ref="form" :rules="rules" :model="form" label-width="70px">
                <el-form-item label="年级" prop="grade">
                    <el-input v-model="form.grade" placeholder="请输入年级名称"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="orderNum">

                    <template>
                        <el-input-number v-model="form.orderNum" :min="1" :max="5" label="排序号"></el-input-number>
                    </template>
                </el-form-item>
                <el-form-item label="科目" prop="courses">
                    <template>
                        <section class="main">
                            <div class="container">
                                <div class="drag-box">
                                    <div class="drag-box-item">
                                        <div class="item-title">全部科目</div>
                                        <draggable v-model="courses" @remove="removeHandle" :options="dragOptions">
                                            <transition-group tag="div" id="todo" class="item-ul">
                                                <div v-for="item in courses" class="drag-list" :key="item.id">
                                                    {{item.courseName + '(' + item.courseDesc + ')'}}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                    <div class="drag-box-item">
                                        <div class="item-title">已选科目</div>
                                        <draggable v-model="choosedCourses" @remove="removeHandle"
                                                   :options="dragOptions">
                                            <transition-group tag="div" id="doing" class="item-ul">
                                                <div v-for="item in choosedCourses" class="drag-list" :key="item.id">
                                                    {{item.courseName + '(' + item.courseDesc + ')'}}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                </div>
                            </div>
                        </section>
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
    import {
        batchRemoveGrade,
        createGrade,
        getAllCourses,
        getGradesByPage,
        removeGrade,
        updateGrade
    } from "../../api/grade";
    import globalConfig from "../../api/config/global_configuration";
    import Utils from "../../utils/utils";
    import draggable from "vuedraggable";

    export default {
        name: 'basetable',
        data() {
            return {
                pageInfo: {
                    pageNum: 1,
                    pageSize: globalConfig.defaultPageSize,
                    condition: {
                        grade: ''
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
                title: "年级管理",
                rules: {
                    grade: [
                        {required: true, message: '请输入年级名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请选择排序号', trigger: 'change'}
                    ]
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                // 所有科目列表
                allCourses: [],
                courses: [],
                choosedCourses: []

            };
        },
        created() {
            this.getData();
            this.getAllCourses();
        },
        methods: {
            // 获取所有科目
            getAllCourses() {
                let graphQLParam = Utils.getGraphQLParam(getAllCourses);
                request.post(graphQLParam).then(data => {
                    let allCourses = data.getAllCourses;
                    this.allCourses = allCourses;
                });
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let variables = {};
                variables.pageInfo = this.pageInfo;
                let graphQLParam = Utils.getGraphQLParam(getGradesByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getGradesByPage;
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
                    let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeGrade, input);
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
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(batchRemoveGrade, input);
                        request.post(mutationGraphQLParam).then(data => {
                            for (let i = 0; i < length; i++) {
                                str += this.multipleSelection[i].grade + ' ';
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
                this.pageInfo.condition.grade = "";
                this.getData();
            },
            handleAdd() {
                // 设置未选择课程
                this.courses = this.allCourses;
                this.addVisible = true;
            },
            // 关闭弹窗清除已选择
            clearCourse() {
                this.courses = [];
                this.choosedCourses = [];
                this.addForm.orderNum = 3;
            },
            saveAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let addForm = this.addForm;
                        let choosedCourses = this.choosedCourses;
                        addForm.courses = choosedCourses;
                        console.log("addForm ==> ", addForm);

                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(createGrade, addForm);
                        console.log("mutationGraphQLParam ==> ", mutationGraphQLParam);
                        request.post(mutationGraphQLParam).then(data => {
                            this.addForm = {};
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
                // 处理显示科目
                let allCourses = this.allCourses;
                this.choosedCourses = row.courses;
                let unChoosedCourses = allCourses.filter(item => !Utils.hasElementByKey(item, "id", this.choosedCourses));
                this.courses = unChoosedCourses;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let input = {
                            id: this.form.id,
                            grade: this.form.grade,
                            orderNum: this.form.orderNum,
                            courses: this.choosedCourses
                        };
                        let graphQLParam = Utils.getMutationGraphQLParam(updateGrade, input);
                        console.log("graphQLParam ==> " ,  graphQLParam);
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
            courseFormatter(row, column) {
                let courses = row.courses;
                if (courses) {
                    let courseStr = courses.map(item => item.courseName).join(",");
                    return courseStr;
                }
                return null;
            },

            removeHandle(event) {
                console.log(event);
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            }
        },
        components: {
            draggable
        },
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


<style scoped>
    .drag-box {
        display: flex;
        user-select: none;
    }

    .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }

    .item-title {
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }

    .item-ul {
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }

    .item-ul::-webkit-scrollbar {
        width: 0;
    }

    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }

    .drag-list:hover {
        border: 1px solid #20a0ff;
    }

    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .ghost-style {
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>