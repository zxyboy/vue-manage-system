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
                <template>
                    <el-select v-model="pageInfo.condition.gradeId" placeholder="请选择年级">
                        <el-option
                                v-for="item in grades"
                                :key="item.id"
                                :label="item.grade"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select v-model="pageInfo.condition.courseId" placeholder="请选择科目">
                        <el-option
                                v-for="item in courses"
                                :key="item.id"
                                :label="item.courseName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select v-model="pageInfo.condition.semesterId" placeholder="请选择学期">
                        <el-option
                                v-for="item in semesters"
                                :key="item.id"
                                :label="item.semester"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>

                <template>
                    <el-select v-model="pageInfo.condition.chapterId" placeholder="请选择单元">
                        <el-option
                                v-for="item in chapters"
                                :key="item.id"
                                :label="item.chapterName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select v-model="pageInfo.condition.questionTypeId" placeholder="请选择试题类型">
                        <el-option
                                v-for="item in questionTypes"
                                :key="item.id"
                                :label="item.questionTypeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select v-model="pageInfo.condition.level" placeholder="请选择试题难度">
                        <el-option
                                v-for="item in levels"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <br>
                <br>
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除
                </el-button>
                <el-input v-model="pageInfo.condition.question" placeholder="问题"
                          class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-s-tools" @click="handleReset">重置</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>

                <el-button type="primary" icon="el-icon-download" @click="handleExport">导入</el-button>
                <br/> <br/>
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

                <el-table-column prop="question" label="题干"></el-table-column>
                <el-table-column prop="questionType.questionTypeName" label="题型" width="80px"></el-table-column>
                <el-table-column prop="grade.grade" label="年级" width="80px"></el-table-column>
                <el-table-column prop="course.courseName" label="科目" width="80px"></el-table-column>
                <el-table-column prop="semester.semester" label="学期" width="90px"></el-table-column>
                <el-table-column prop="chapter.chapterName" label="单元" width="90px"></el-table-column>
                <el-table-column prop="level" label="难度">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row.level" :disabled="true" :show-text="true"
                                 :texts="['容易', '一般', '中等', '难', '特难']"></el-rate>
                    </template>
                </el-table-column>
                <el-table-column prop="answer" label="答案"></el-table-column>


                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormat"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="text"
                                icon="el-icon-view"
                                class="green"
                                @click="handleDetail(scope.$index, scope.row)"
                        >查看
                        </el-button>
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


        <!-- 弹出框 -->
        <el-dialog :title="dialog.title" :visible.sync="visible" width="50%">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="年级" prop="gradeId">
                    <template>
                        <el-select v-model="form.gradeId" placeholder="请选择年级" :disabled="form.detail">
                            <el-option
                                    v-for="item in grades"
                                    :key="item.id"
                                    :label="item.grade"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="科目" prop="courseId">
                    <template>
                        <el-select v-model="form.courseId" placeholder="请选择科目" :disabled="form.detail">
                            <el-option
                                    v-for="item in courses"
                                    :key="item.id"
                                    :label="item.courseName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>

                <el-form-item label="学期" prop="semesterId">
                    <template>
                        <el-select v-model="form.semesterId" placeholder="请选择学期" :disabled="form.detail">
                            <el-option
                                    v-for="item in semesters"
                                    :key="item.id"
                                    :label="item.semester"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>

                <el-form-item label="单元" prop="chapterId">
                    <template>
                        <el-select v-model="form.chapterId" placeholder="请选择单元" :disabled="form.detail">
                            <el-option
                                    v-for="item in chapters"
                                    :key="item.id"
                                    :label="item.chapterName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>

                <el-form-item label="试题类型" prop="questionTypeId">
                    <template>
                        <el-select v-model="form.questionTypeId" placeholder="请选择试题类型"
                                   @change="questionTypeChange" :disabled="form.detail">
                            <el-option
                                    v-for="item in questionTypes"
                                    :key="item.id"
                                    :label="item.questionTypeName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>

                <el-form-item label="难度" prop="level">
                    <template>
                        <el-rate v-model="form.level" :show-text="true"
                                 :disabled="form.detail"
                                 :texts="['容易', '一般', '中等', '难', '特难']"></el-rate>
                    </template>
                </el-form-item>
                <el-form-item label="问题" prop="question">
                    <el-input
                            type="textarea"
                            autosize
                            placeholder="请输入问题"
                            :disabled="form.detail"
                            v-model="form.question">
                    </el-input>
                </el-form-item>

                <el-form-item label="问题图片" prop="questionUrl" v-if="!(!form.questionUrl && form.detail)">

                    <el-upload
                            :disabled="form.detail"
                            :action="imageAction"
                            list-type="picture-card"
                            accept=".png,.jpg,.jpeg,.gif"
                            :headers="uploadHeader"
                            :file-list="fileList"
                            :on-success="uploadImgSuccess"
                            :on-error="uploadImgError"
                            :before-upload="beforeUploadImage">
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                 <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                <i class="el-icon-download"></i>
                </span>
                <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                >
                 <i class="el-icon-delete"></i>
            </span>
             </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>

                </el-form-item>


                <template v-if="uniqueType == 1 || uniqueType == 2">
                    <el-form-item label="选项A" prop="optionOne">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项A"
                                v-model="form.optionOne">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="选项B" prop="optionTwo">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项B"
                                v-model="form.optionTwo">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选项C" prop="optionThree">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项C"
                                v-model="form.optionThree">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选项D" prop="optionFour">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项D"
                                v-model="form.optionFour">
                        </el-input>
                    </el-form-item>
                </template>
                <template v-if="uniqueType == 2">
                    <el-form-item label="选项E" prop="optionFive">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项E"
                                v-model="form.optionFive">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选项F" prop="optionSix">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项F"
                                v-model="form.optionSix">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选项G" prop="optionSeven">
                        <el-input

                                :disabled="form.detail"
                                type="textarea"
                                autosize
                                placeholder="请输入选项G"
                                v-model="form.optionSeven">
                        </el-input>
                    </el-form-item>
                </template>
                <el-form-item label="答案" prop="answer">

                    <el-select v-if="uniqueType == 3" v-model="form.answer"
                               :disabled="form.detail"
                               placeholder="请选择答案">
                        <el-option value="1" label="正确"></el-option>
                        <el-option value="0" label="错误"></el-option>
                    </el-select>
                    <el-input v-else
                              :disabled="form.detail"
                              type="textarea"
                              autosize
                              placeholder="请输入答案"
                              v-model="form.answer">
                    </el-input>
                </el-form-item>
                <el-form-item label="答案图片" prop="answerUrl" v-if="!(!form.answerUrl && form.detail)">
                    <el-upload
                            :disabled="form.detail"
                            :action="imageAction"
                            list-type="picture-card"
                            accept=".png,.jpg,.jpeg,.gif"
                            :headers="uploadHeader"
                            :file-list="answerFileList"
                            :on-success="uploadAnswerImgSuccess"
                            :on-error="uploadImgError"
                            :before-upload="beforeUploadImage"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img
                                    class="el-upload-list__item-thumbnail"
                                    :src="file.url" alt="">
                            <span class="el-upload-list__item-actions">
                 <span
                         class="el-upload-list__item-preview"
                         @click="handlePictureCardPreview(file)"
                 >
                <i class="el-icon-zoom-in"></i>
                </span>
                <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                >
                <i class="el-icon-download"></i>
                </span>
                <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleAnswerRemove(file)"
                >
                 <i class="el-icon-delete"></i>
            </span>
             </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>

                </el-form-item>
                <el-form-item label="答案分析" prop="analysis" v-if="!(!form.analysis && form.detail)">
                    <el-input
                            :disabled="form.detail"
                            type="textarea"
                            autosize
                            placeholder="请输入答案分析"
                            v-model="form.analysis">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="save('form')">确 定</el-button>
                    </span>
        </el-dialog>


        <!-- 导入弹出框 -->
        <el-dialog title="导入" :visible.sync="exportVisible" width="50%">
            <el-form ref="exportForm" label-width="80px">
                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            drag
                            :action="excelAction"
                            accept=".xlsx,.xls"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            :headers="uploadHeader"
                            :before-upload="beforeUploadExcel"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传Excel模板文件，且不超过10M</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="exportVisible = false">取 消</el-button>
                        <el-button type="primary" @click="exportVisible = false">确 定</el-button>
                    </span>
        </el-dialog>

    </div>
</template>

<script>
    import request from "../../utils/request";
    import {
        batchRemoveQuestionItem,
        createQuestionItem,
        getQuestionItemsByPage,
        queryAllOptions,
        removeImage,
        removeQuestionItem,
        updateQuestionItem
    } from "../../api/question_item";
    import globalConfig from "../../api/config/global_configuration";
    import Utils from "../../utils/utils";

    export default {
        name: 'basetable',
        data() {
            return {
                imageAction : globalConfig.host + "api/upload/uploadImg",
                excelAction: globalConfig.host + "api/upload/uploadExcel",
                dialog: {
                    title: "新增"
                },
                // 图片上传有关
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                fileList: [],
                answerFileList: [],

                pageInfo: {
                    pageNum: 1,
                    pageSize: globalConfig.defaultPageSize,
                    descFields: ['create_time'],
                    condition: {}
                },
                uploadHeader: {
                    Authorization: localStorage.getItem(globalConfig.token)
                },
                grades: [],
                courses: [],
                semesters: [],
                chapters: [],
                questionTypes: [],
                questionTypeMap: {},
                levels: [
                    {
                        id: 1,
                        text: "容易"
                    },
                    {
                        id: 2,
                        text: "一般"
                    },
                    {
                        id: 3,
                        text: "中等"
                    },
                    {
                        id: 4,
                        text: "难"
                    },
                    {
                        id: 5,
                        text: "特难"
                    },
                ],
                tableData: [],
                multipleSelection: [],
                uniqueType: 0,
                delList: [],
                exportVisible: false,
                visible: false,
                pageTotal: 0,
                form: {
                    grade: {},
                    course: {},
                    chapter: {},
                    semester: {},
                    questionType: {}
                },
                addForm: {
                    level: 1
                },
                idx: -1,
                id: -1,
                title: "题库管理",
                rules: {
                    question: [
                        {required: true, message: '请输入问题（题干）', trigger: 'blur'},
                        {min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur'}
                    ],
                    answer: [
                        {required: true, message: '请输入答案', trigger: 'blur'},
                        {min: 1, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur'}
                    ],
                    gradeId: [
                        {required: true, message: '请选择年级', trigger: 'change'}
                    ],
                    courseId: [
                        {required: true, message: '请选择科目', trigger: 'change'}
                    ],
                    semesterId: [
                        {required: true, message: '请选择学期', trigger: 'change'}
                    ],
                    chapterId: [
                        {required: true, message: '请选择单元', trigger: 'change'}
                    ],
                    questionTypeId: [
                        {required: true, message: '请选择试题类型', trigger: 'change'}
                    ],
                    level: [
                        {required: true, message: '请选择试题难度', trigger: 'change'}
                    ]
                }
            };
        },
        created() {
            this.queryAllOptions();
            this.getData();
        },
        methods: {
            questionTypeChange(v) {
                this.uniqueType = this.questionTypeMap[v].uniqueType;
            },
            queryAllOptions() {

                let graphQLParam = Utils.getGraphQLParam(queryAllOptions);
                request.post(graphQLParam).then(data => {
                    this.grades = data.getAllGrades;
                    this.courses = data.getAllCourses;
                    this.semesters = data.getAllSemesters;
                    this.chapters = data.getAllChapters;
                    this.questionTypes = data.getAllQuestionTypes;

                    this.questionTypes.forEach(item => {
                        this.questionTypeMap[item.id] = item;
                    });


                });
            },
            getData() {
                let variables = {};
                variables.pageInfo = this.pageInfo;
                let graphQLParam = Utils.getGraphQLParam(getQuestionItemsByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getQuestionItemsByPage;
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
                    let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeQuestionItem, input);
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
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(batchRemoveQuestionItem, input);
                        request.post(mutationGraphQLParam).then(data => {
                            for (let i = 0; i < length; i++) {
                                str += this.multipleSelection[i].question + ' ';
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
                this.pageInfo.condition = {};
                this.getData();
            },
            save(form) {
                // 新增
                if (this.form.add) {
                    this.saveAdd(form);
                } else if (this.form.edit) {  // 修改
                    this.saveEdit(form);
                } else if (this.form.detail) { // 详情
                    this.visible = false;
                } else {
                    this.$message.error("错误!");
                }

            },
            handleAdd() {
                this.form = this.addForm;
                this.form.add = true;
                this.fileList = [];
                this.answerFileList = [];
                this.visible = true;
            },
            saveAdd(formName) {

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let form = this.form;
                        if (this.fileList.length > 0) {
                            form.questionUrl = this.fileList.map(item => item.url.replace(globalConfig.imageHost, "")).join(",");
                        }
                        if (this.answerFileList.length > 0) {
                            form.answerUrl = this.answerFileList.map(item => item.url.replace(globalConfig.imageHost, "")).join(",");
                        }
                        delete form.add;
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(createQuestionItem, form);
                        request.post(mutationGraphQLParam).then(data => {
                            this.visible = false;
                            this.$message.success(`添加成功`);
                            this.getData();
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleDetail(index, row) {
                this.idx = index;
                this.form = Utils.deepClone(row);
                this.form.detail = true;
                this.fileList = Utils.getFileList(row.questionUrl);
                this.answerFileList = Utils.getFileList(row.answerUrl);
                this.dialog.title = "详情";
                this.uniqueType = this.questionTypeMap[row.questionType.id].uniqueType;
                this.visible = true;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = Utils.deepClone(row);
                this.form.edit = true;
                this.fileList = Utils.getFileList(row.questionUrl);
                this.answerFileList = Utils.getFileList(row.answerUrl);
                this.dialog.title = "编辑";
                this.uniqueType = this.questionTypeMap[row.questionType.id].uniqueType;
                this.visible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let input = Utils.deepClone(this.form);
                        delete input.course;
                        delete input.chapter;
                        delete input.grade;
                        delete input.semester;
                        delete input.questionType;
                        delete input.createTime;
                        delete input.updateTime;
                        delete input.user;
                        delete input.edit;

                        if (this.fileList.length > 0) {
                            input.questionUrl = this.fileList.map(item => item.url.replace(globalConfig.imageHost, "")).join(",");
                        }
                        if (this.answerFileList.length > 0) {
                            input.answerUrl = this.answerFileList.map(item => item.url.replace(globalConfig.imageHost, "")).join(",");
                        }
                        let graphQLParam = Utils.getMutationGraphQLParam(updateQuestionItem, input);
                        request.post(graphQLParam).then(data => {
                            this.visible = false;
                            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.getData();
                        });
                    } else {
                        return false;
                    }
                });

            },
            handleExport() {
                this.exportVisible = true;
            },

            // 分页导航
            handlePageChange(val) {
                this.$set(this.pageInfo, 'pageNum', val);
                this.getData();
            },

            // 创建时间格式化
            timeFormat(row, column) {

                let time = row.createTime;
                if (!time){
                    return null;
                }
                return Utils.strToDateStr(new Date(time));
            },
            beforeUploadExcel(file) {
                return Utils.limitUpdateFileSize(file, globalConfig.maxExcelFileSize, this);
            },
            beforeUploadImage(file) {
                return Utils.limitUpdateFileSize(file, globalConfig.maxImageFileSize, this);
            },
            uploadSuccess(response, file, fileList) {
                this.$message.success("导入成功!");
            },
            uploadError(err, file, fileList) {
                this.$message.error("导入失败，原因：" + err);
            },
            // 图片上传有关
            handleRemove(file) {
                Utils.removeFile(file, this.fileList, removeImage, this);
            },
            handleAnswerRemove(file) {
                Utils.removeFile(file, this.answerFileList, removeImage, this);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleDownload(file) {
                Utils.downloadImage(file.url, this);
            },

            uploadImgSuccess(response, file, fileList) {
                Utils.uploadImageSuccess(response, this.fileList, this);
            },
            uploadImgError(err, file, fileList) {
                this.$message.error("上传图片失败，原因：" + err);
            },
            uploadAnswerImgSuccess(response, file, fileList) {
                Utils.uploadImageSuccess(response, this.answerFileList, this);
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

    .green {
        color: coral;
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
