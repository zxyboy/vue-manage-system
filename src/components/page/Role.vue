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
                <el-input v-model="pageInfo.condition.roleName" placeholder="角色"
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
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

                <el-table-column prop="isShow" label="是否让程序选择">
                    <template slot-scope="scope">{{scope.row.isShow == 1 ? '是' : '否'}}</template>
                </el-table-column>
                <el-table-column prop="isAdmin" label="是否是管理员">
                    <template slot-scope="scope">{{scope.row.isAdmin == 1 ? '是' : '否' }}</template>
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
        <el-dialog title="新增" :visible.sync="addVisible" width="50%" @closed="clearMenu">
            <el-form ref="addForm" :rules="rules" :model="addForm" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc" placeholder="请输入角色描述"></el-input>
                </el-form-item>

                <el-form-item label="用户选择" prop="isShow">
                    <el-select v-model="addForm.isShow" placeholder="请选择是否被选择">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="管理员" prop="isAdmin">
                    <el-select v-model="addForm.isAdmin" placeholder="请选择是否是管理员">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="菜单" prop="menus">
                    <template>
                        <section class="main">
                            <div class="container">
                                <div class="drag-box">
                                    <div class="drag-box-item">
                                        <div class="item-title">全部菜单</div>
                                        <draggable v-model="menus" :options="dragOptions">
                                            <transition-group tag="div" id="todo-1" class="item-ul">
                                                <div v-for="item in menus" class="drag-list" :key="item.id">
                                                    {{item.title + '(' + item.index + ')'}}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                    <div class="drag-box-item">
                                        <div class="item-title">已选菜单</div>
                                        <draggable v-model="choosedMenus"
                                                   :options="dragOptions">
                                            <transition-group tag="div" id="doing-1" class="item-ul">
                                                <div v-for="item in choosedMenus" class="drag-list" :key="item.id">
                                                    {{item.title + '(' + item.index + ')'}}
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%" @closed="clearMenu">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
                </el-form-item>

                <el-form-item label="用户选择" prop="isShow">
                    <el-select v-model="form.isShow" placeholder="请选择是否被选择">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="管理员" prop="isAdmin">
                    <el-select v-model="form.isAdmin" placeholder="请选择是否是管理员">
                        <el-option value="1" label="是"></el-option>
                        <el-option value="0" label="否"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="菜单" prop="menus">
                    <template>
                        <section class="main">
                            <div class="container">
                                <div class="drag-box">
                                    <div class="drag-box-item">
                                        <div class="item-title">全部菜单</div>
                                        <draggable v-model="menus" :options="dragOptions">
                                            <transition-group tag="div" id="todo" class="item-ul">
                                                <div v-for="item in menus" class="drag-list" :key="item.id">
                                                    {{item.title + '(' + item.index + ')'}}
                                                </div>
                                            </transition-group>
                                        </draggable>
                                    </div>
                                    <div class="drag-box-item">
                                        <div class="item-title">已选菜单</div>
                                        <draggable v-model="choosedMenus"
                                                   :options="dragOptions">
                                            <transition-group tag="div" id="doing" class="item-ul">
                                                <div v-for="item in choosedMenus" class="drag-list" :key="item.id">
                                                    {{item.title + '(' + item.index + ')'}}
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
    import {batchRemoveRole, createRole, getAllMenus, getRolesByPage, removeRole, updateRole} from "../../api/role";
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
                        roleName: ''
                    }
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                addForm: {
                    isShow: '0',
                    isAdmin: '0'
                },
                defaultAddForm: {
                    isShow: '0',
                    isAdmin: '0'
                },
                addVisible: false,
                idx: -1,
                id: -1,
                title: "角色管理",
                rules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    isShow: [
                        {required: true, message: '请选择是否可被用户选择', trigger: 'change'}
                    ],
                    isAdmin: [
                        {required: true, message: '请选择是否是管理员', trigger: 'change'}
                    ]
                },
                dragOptions: {
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                // 所有菜单列表
                allMenus: [],
                menus: [],
                choosedMenus: []

            };
        },
        created() {
            this.getData();
            this.getAllMenus();
        },
        methods: {
            // 获取所有菜单
            getAllMenus() {
                let graphQLParam = Utils.getGraphQLParam(getAllMenus);
                request.post(graphQLParam).then(data => {
                    let allMenus = data.getAllMenus.filter(item => item.id != 0);
                    this.allMenus = allMenus;
                });
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                let variables = {};
                variables.pageInfo = this.pageInfo;
                let graphQLParam = Utils.getGraphQLParam(getRolesByPage, variables);
                request.post(graphQLParam).then(data => {
                    let res = data.getRolesByPage;
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
                    let mutationGraphQLParam = Utils.getMutationGraphQLParam(removeRole, input);
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
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(batchRemoveRole, input);
                        request.post(mutationGraphQLParam).then(data => {
                            for (let i = 0; i < length; i++) {
                                str += this.multipleSelection[i].roleName + ' ';
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
                this.pageInfo.condition.roleName = "";
                this.getData();
            },
            handleAdd() {
                // 设置未选择课程
                this.menus = this.allMenus;
                this.addVisible = true;
            },
            // 关闭弹窗清除已选择
            clearMenu() {
                this.menus = [];
                this.choosedMenus = [];
            },
            saveAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let addForm = this.addForm;
                        addForm.menus = this.choosedMenus.map(item => item.id);
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(createRole, addForm);
                        request.post(mutationGraphQLParam).then(data => {
                            this.addForm = this.defaultAddForm;
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
                this.form.isAdmin = row.isAdmin + '';
                this.form.isShow = row.isShow + '';
                // 处理显示菜单
                let allMenus = this.allMenus;
                this.choosedMenus = row.menus;
                let unChoosedMenus = allMenus.filter(item => !Utils.hasElementByKey(item, "id", this.choosedMenus));
                this.menus = unChoosedMenus;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let choosedMenuIds = this.choosedMenus.map(item => item.id);
                        let input = {
                            id: this.form.id,
                            roleName: this.form.roleName,
                            roleDesc: this.form.roleDesc,
                            isAdmin: this.form.isAdmin,
                            isShow: this.form.isShow,
                            menus: choosedMenuIds
                        };
                        let graphQLParam = Utils.getMutationGraphQLParam(updateRole, input);
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

            //
            // removeHandle(event) {
            //     console.log(event);
            //     this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            // }
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