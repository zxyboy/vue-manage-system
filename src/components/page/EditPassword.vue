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
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" disabled></el-input>
                </el-form-item>

                <el-form-item label="原密码" prop="pwd">
                    <el-input type="password" v-model="form.pwd" placeholder="请输入原始密码"></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="newPwd">
                    <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkNewPwd">
                    <el-input type="password" v-model="form.checkNewPwd" placeholder="请再次确认新密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clearForm('form')">清 空</el-button>
                <el-button type="primary" @click="saveEdit('form')">修改密码</el-button>
            </span>
        </div>
    </div>
</template>

<script>
    import request from "../../utils/request";
    import {updatePassword} from "../../api/edit_password";
    import Utils from "../../utils/utils";
    import globalConfig from "../../api/config/global_configuration";
    import {getUserInfo} from "../../api/userInfo";

    export default {
        data() {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form.checkNewPwd !== '') {
                        this.$refs.form.validateField('checkNewPwd');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                form: {},
                title: "科目管理",
                rules: {
                    pwd: [
                        {required: true, message: '请输入原始密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 10 个字符', trigger: 'blur'}
                    ],
                    newPwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkNewPwd: [
                        {required: true, message: '请再次确认新密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],

                }

            };
        },
        created() {
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                let item = localStorage.getItem(globalConfig.userInfo);
                if (item) {
                    let data = JSON.parse(item);
                    this.form = data;

                } else {
                    let graphQLParam = Utils.getGraphQLParam(getUserInfo);
                    request.post(graphQLParam).then(data => {
                        this.form = data.getUserInfo;
                    });
                }

            },
            // 获取 easy-mock 的模拟数据
            clearForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 保存编辑
            saveEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        let input = {
                            newPwd: this.form.newPwd,
                            pwd: this.form.pwd,
                        };
                        let graphQLParam = Utils.getMutationGraphQLParam(updatePassword, input);
                        request.post(graphQLParam).then(data => {

                            // 提示重新登录
                            this.$confirm('密码修改成功,确定要重新登录吗？', '提示', {
                                type: 'warning'
                            }).then(() => {
                                Utils.routerToLogin(this);
                            }).catch(() => {
                                Utils.routerToLogin(this);
                            });

                        });
                    } else {
                        return false;
                    }
                });

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
