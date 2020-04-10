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
                <el-input v-model="pageInfo.condition.questionTypeName" placeholder="试题类型"
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
                <el-table-column prop="questionTypeName" label="试题类型"></el-table-column>
                <el-table-column prop="orderNum" label="排序号(数字越小，查询越靠前)"></el-table-column>
                <el-table-column prop="uniqueType" label="唯一类型编码"></el-table-column>
                <el-table-column prop="adviceDuration" label="建议做题时长（分钟）">
                    <template slot-scope="scope">{{ scope.row.adviceDuration +  '分钟' }}</template>
                </el-table-column>

                <el-table-column prop="isObjective" label="是否是客观题">
                    <template slot-scope="scope">{{ scope.row.isObjective == 1 ? '是' : '否' }}</template>
                </el-table-column>

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
                <el-form-item label="试题类型" prop="questionTypeName">
                    <el-input v-model="addForm.questionTypeName" placeholder="请输入试题类型名称"></el-input>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="addForm.orderNum" :min="1" :max="5" label="排序号"></el-input-number>
                    </template>
                </el-form-item>
                <el-form-item label="类型编码" prop="uniqueType">
                    <template>
                        <el-input-number v-model="addForm.uniqueType" :min="1" :max="20" label="类型编码"></el-input-number>

                    </template>
                </el-form-item>
                <el-form-item label="做题时长" prop="adviceDuration">
                    <template>
                        <el-input-number v-model="addForm.adviceDuration" :step="2" :min="1" :max="30" label="做题时长"></el-input-number>
                        分钟
                    </template>
                </el-form-item>

                <el-form-item label="客观题" prop="isObjective">
                    <el-select v-model="addForm.isObjective" placeholder="请选择是否是客观题">
                        <el-option label="是" value="1" ></el-option>
                        <el-option label="否"  value="0"></el-option>
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
                <el-form-item label="试题类型" prop="questionTypeName">
                    <el-input v-model="form.questionTypeName" placeholder="请输入试题类型名称"></el-input>
                </el-form-item>

                <el-form-item label="排序号" prop="orderNum">
                    <template>
                        <el-input-number v-model="form.orderNum" :min="1" :max="5" label="排序号"></el-input-number>
                    </template>
                </el-form-item>
                <el-form-item label="类型编码" prop="uniqueType">
                    <template>
                        <el-input-number v-model="form.uniqueType" :min="1" :max="20" label="类型编码"></el-input-number>

                    </template>
                </el-form-item>
                <el-form-item label="做题时长" prop="adviceDuration">
                    <template>
                        <el-input-number v-model="form.adviceDuration" :step="2" :min="1" :max="30" label="做题时长"></el-input-number>
                        分钟
                    </template>
                </el-form-item>

                <el-form-item label="客观题" prop="isObjective">
                    <el-select v-model="form.isObjective" placeholder="请选择是否是客观题">
                        <el-option label="是" value="1" ></el-option>
                        <el-option label="否"  value="0"></el-option>
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
    import {batchRemoveQuestionType, createQuestionType, getQuestionTypesByPage, removeQuestionType, updateQuestionType} from "../../api/question_type";
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
                        questionTypeName: ''
                    }
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                addForm: {
                    orderNum: 3,
                    adviceDuration : 5,
                    uniqueType : 2,
                    isObjective : '0'
                },
                addVisible: false,
                idx: -1,
                id: -1,
                title: "试题类型管理",
                rules: {
                    questionTypeName: [
                        {required: true, message: '请输入试题类型名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    isObjective:  [
                        { required: true, message: '请选择是否是客观题', trigger: 'change' }
                    ],
                    orderNum: [
                        {required: true, message: '请选择排序号', trigger: 'change'}
                    ],
                    uniqueType: [
                        {required: true, message: '请选择类型编码', trigger: 'change'}
                    ],
                    adviceDuration: [
                        {required: true, message: '请选择做题时长', trigger: 'change'}
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
                let graphQLParam = Utils.getGraphQLParam(getQuestionTypesByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getQuestionTypesByPage;
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
                    let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeQuestionType, input);
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
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(batchRemoveQuestionType, input);
                        request.post(mutationGraphQLParam).then(data => {
                            for (let i = 0; i < length; i++) {
                                str += this.multipleSelection[i].questionTypeName + ' ';
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
                this.pageInfo.condition.questionTypeName = "";
                this.getData();
            },
            handleAdd() {
                this.addVisible = true;
            },
            saveAdd(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let addForm = this.addForm;
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(createQuestionType, addForm);
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
                this.form.isObjective = row.isObjective + '';
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let input = {
                            id: this.form.id,
                            questionTypeName: this.form.questionTypeName,
                            orderNum: this.form.orderNum,
                            adviceDuration : this.form.adviceDuration,
                            uniqueType : this.form.uniqueType,
                            isObjective : this.form.isObjective
                        };
                        let graphQLParam = Utils.getMutationGraphQLParam(updateQuestionType, input);
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
