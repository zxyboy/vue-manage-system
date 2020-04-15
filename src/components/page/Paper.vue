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
                    <el-select v-model="pageInfo.condition.level" placeholder="请选择试题难度">
                        <el-option
                                v-for="item in levels"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>

                <template>
                    <el-select v-model="pageInfo.condition.status" placeholder="请选择试卷状态">
                        <el-option value="1" label="未分配"></el-option>
                        <el-option value="2" label="已分配"></el-option>
                    </el-select>
                </template>
                <br>
                <br>

                <el-input v-model="pageInfo.condition.paperTitle" placeholder="试卷标题"
                          class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-s-tools" @click="handleReset">重置</el-button>
                <br/> <br/>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >

                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="paperTitle" label="试卷标题" width="250px"></el-table-column>
                <el-table-column prop="totalQuestionItemNum" label="试题总数" width="80px"></el-table-column>
                <el-table-column prop="status" label="试卷状态" width="80px">
                    <template slot-scope="scope">{{scope.row.status == 1 ? '已创建': '已分配'}}</template>
                </el-table-column>
                <el-table-column prop="creator.nickname" label="出题人"></el-table-column>
                <el-table-column prop="grade.grade" label="年级" width="80px"></el-table-column>
                <el-table-column prop="course.courseName" label="科目" width="80px"></el-table-column>
                <el-table-column prop="semester.semester" label="学期" width="90px"></el-table-column>
                <el-table-column prop="chapter.chapterName" label="单元" width="90px"></el-table-column>
                <el-table-column prop="level" label="难度" width="180px">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row.level" :disabled="true" :show-text="true"
                                 :texts="['容易', '一般', '中等', '难', '特难']"></el-rate>
                    </template>
                </el-table-column>

                <el-table-column prop="totalPoints" label="总分" width="60px"></el-table-column>
                <el-table-column prop="totalTime" label="考试时长" width="80px">
                    <template slot-scope="scope">{{scope.row.totalTime}}分钟</template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormat"></el-table-column>
                <el-table-column prop="deadline" label="截止日期" :formatter="timeDeadlineFormat"></el-table-column>

                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">

                        <el-button
                                type="text"
                                icon="el-icon-view"
                                class="green"
                                @click="handleDetail(scope.$index, scope.row)"
                        >查看
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
        <el-dialog :title="dialog.title" :visible.sync="visible" width="80%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="年级" prop="gradeId">
                    <template>
                        <el-select v-model="form.gradeId">
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
                        <el-select v-model="form.courseId">
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
                        <el-select v-model="form.semesterId">
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
                        <el-select v-model="form.chapterId">
                            <el-option
                                    v-for="item in chapters"
                                    :key="item.id"
                                    :label="item.chapterName"
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
                <el-form-item label="试卷标题" prop="paperTitle">
                    <el-input
                            type="textarea"
                            autosize
                            v-model="form.paperTitle">
                    </el-input>
                </el-form-item>

                <el-form-item label="总分" prop="totalPoints">
                    <el-input
                            type="textarea"
                            autosize
                            v-model="form.totalPoints">
                    </el-input>
                </el-form-item>

                <el-form-item label="总题数量" prop="totalQuestionItemNum">
                    <el-input
                            type="textarea"
                            autosize
                            v-model="form.totalQuestionItemNum">
                    </el-input>
                </el-form-item>

                <el-form-item label="出题人">
                    <el-input
                            type="textarea"
                            autosize
                            v-model="form.creator.nickname">
                    </el-input>
                </el-form-item>
                <el-form-item label="过期时间" prop="deadline">
                    <el-input
                            type="textarea"
                            autosize
                            v-model="form.deadline">
                    </el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-input
                            type="textarea"
                            autosize
                            v-model="form.createTime">
                    </el-input>
                </el-form-item>
                <el-form-item label="做题详情">


                    <el-table
                            :data="detailTableData"
                            border
                            class="table"
                            ref="multipleTable"
                            header-cell-class-name="table-header"
                    >
                        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                        <el-table-column prop="user.nickname" label="做题人"></el-table-column>


                        <el-table-column prop="userPaperStatus" label="试卷状态" width="100px"
                                         :formatter="userPaperStatusFormat"></el-table-column>
                        <el-table-column prop="scores" label="得分" width="60px">
                            <template slot-scope="scope">{{scope.row.scores ? scope.row.scores : 0}}</template>
                        </el-table-column>
                        <el-table-column prop="userTotalTime" label="考试用时" :formatter="totalTimeFormat"
                                         width="80px"></el-table-column>
                        <el-table-column prop="examStartTime" label="考试开始时间" :formatter="timeFormat"></el-table-column>
                        <el-table-column prop="examEndTime" label="考试结束时间" :formatter="timeFormat"></el-table-column>
                        <el-table-column prop="checkUser.nickname" label="批改人"></el-table-column>


                        <el-table-column prop="examStartCheckTime" label="批改开始时间"
                                         :formatter="timeFormat"></el-table-column>
                        <el-table-column prop="examEndCheckTime" label="批改结束时间"
                                         :formatter="timeFormat"></el-table-column>

                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="visible = false">取 消</el-button>
                        <el-button type="primary" @click="visible = false">确 定</el-button>
                    </span>
        </el-dialog>


    </div>
</template>

<script>
    import request from "../../utils/request";
    import {getAllPapersByPage, getPaperUserScoresByPaperId, queryAllOptions} from "../../api/paper";
    import globalConfig from "../../api/config/global_configuration";
    import Utils from "../../utils/utils";

    export default {
        name: 'basetable',
        data() {
            return {
                dialog: {
                    title: "详情"
                },
                pageInfo: {
                    pageNum: 1,
                    pageSize: globalConfig.defaultPageSize,
                    descFields: ['create_time'],
                    condition: {}
                },
                grades: [],
                courses: [],
                semesters: [],
                chapters: [],
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
                // 详情数据表格数据
                detailTableData: [],
                visible: false,
                pageTotal: 0,
                form: {
                    grade: {},
                    course: {},
                    chapter: {},
                    semester: {},
                    creator: {},
                },
                idx: -1,
                id: -1,
                title: "试卷管理"

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
                });
            },
            getData() {
                let variables = {};
                variables.pageInfo = this.pageInfo;
                let graphQLParam = Utils.getGraphQLParam(getAllPapersByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getAllPapersByPage;
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
                this.pageInfo.condition = {};
                this.getData();
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.pageInfo, 'pageNum', val);
                this.getData();
            },
            handleDetail(idx, row) {
                this.form = row;
                let mutationGraphQLParam = Utils.getMutationGraphQLParam(getPaperUserScoresByPaperId, row.id, "paperId");
                request.post(mutationGraphQLParam).then(data => {
                    this.detailTableData = data.getPaperUserScoresByPaperId;
                    this.visible = true;
                });
            },
            // 创建时间格式化
            timeFormat(row, column) {
                let property = column.property;

                let dateStr = row[property];
                if (!dateStr) {
                    return null;
                }
                return Utils.strToDateStr(dateStr);
            },
            timeDeadlineFormat(row, column) {
                let property = column.property;
                let dateStr = row[property];
                if (!dateStr) {
                    return null;
                }
                return Utils.strToDateStr(row[property], "yyyy-MM-dd");
            },
            userPaperStatusFormat(row, column) {
                let userPaperStatus = row[column.property];
                let result = '未知';
                switch (userPaperStatus) {
                    case 1 :
                        result = '未做';
                        break;
                    case 2 :
                        result = '已交卷';
                        break;
                    case 3 :
                        result = '已批改';
                        break;
                    case 4 :
                        result = '正在批改中';
                        break;
                    case 5 :
                        result = '正在做题中';
                        break
                    default:
                        break;
                }
                return result;
            },
            totalTimeFormat(row, column) {
                let totalTime = row[column.property];
                return Utils.formatSeconds(totalTime);
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
