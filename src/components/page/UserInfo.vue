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
            <el-form ref="form" :rules="rules" :model="form" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>

                <el-form-item label="头像" prop="avatarUrl">
                    <el-upload
                            class="avatar-uploader"
                            :action="action"
                            :show-file-list="false"
                            accept=".png,.jpg,.jpeg,.gif"
                            :on-success="handleAvatarSuccess"
                            :headers="uploadHeader"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit('form')">保 存</el-button>
            </span>
        </div>
    </div>
</template>

<script>
    import request from "../../utils/request";
    import {getUserInfo, updateAvatarUrl, updateUser} from "../../api/userInfo";
    import Utils from "../../utils/utils";
    import globalConfig from "../../api/config/global_configuration";
    import {removeImage} from "../../api/question_item";

    export default {
        data() {
            return {
                action: globalConfig.host + "api/upload/uploadImg",
                form: {},
                title: "用户信息",
                imageUrl: '',
                uploadHeader: {
                    Authorization: localStorage.getItem(globalConfig.token)
                },
                fileList: [],
                originalFileList: [],
                rules: {
                    email: [{
                        required: true,//是否必填
                        message: '请输入邮箱地址',//错误提示信息
                        trigger: 'blur'//检验方式（blur为鼠标点击其他地方，）
                    },
                        {
                            type: 'email',//要检验的类型（number，email，date等）
                            message: '请输入正确的邮箱地址',
                            trigger: ['blur', 'change']
                        }
                    ]
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
                    let url = globalConfig.imageHost + data.avatarUrl;
                    let file = {
                        url: url
                    };
                    this.fileList.push(file);
                    this.imageUrl = url;
                } else {
                    let graphQLParam = Utils.getGraphQLParam(getUserInfo);
                    request.post(graphQLParam).then(data => {
                        this.form = data.getUserInfo;
                        let url = globalConfig.imageHost + this.form.avatarUrl;
                        let file = {
                            url: url
                        };
                        this.fileList.push(file);
                        this.imageUrl = url;
                    });
                }

            },
            saveEdit(form) {
                this.$refs[form].validate(valid => {
                    if (valid) {
                        let url = this.imageUrl.replace(globalConfig.imageHost, "");
                        let input = {
                            email: this.form.email,
                            avatarUrl: url
                        };
                        let mutationGraphQLParam = Utils.getMutationGraphQLParam(updateUser, input);
                        request.post(mutationGraphQLParam).then(data => {
                            this.$message.success("保存成功");
                        });

                    } else {
                        return false;
                    }
                });
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log("res ==> ", res, "file ==> ", file)
                let url = res.data.url;
                let mutationGraphQLParam = Utils.getMutationGraphQLParam(updateAvatarUrl, url, 'avatarUrl');
                request.post(mutationGraphQLParam).then(data => {
                    let file = {
                        url: globalConfig.imageHost + url
                    }
                    if (this.fileList.length > 0) {
                        this.originalFileList = this.fileList;
                    }
                    this.fileList = [];
                    this.fileList.push(file);


                    // 重新获取用户数据
                    let graphQLParam = Utils.getGraphQLParam(getUserInfo);
                    request.post(graphQLParam).then(data => {
                        localStorage.setItem(globalConfig.userInfo, JSON.stringify(data.getUserInfo));
                        this.$message.success("头像保存成功");
                    });

                    // 删除原来头像
                    this.originalFileList.forEach(item => {
                        Utils.removeFile(item, this.originalFileList, removeImage);
                    });

                });
            },
            uploadImgError(err, file, fileList) {
                this.$message.error("上传图片失败，原因：" + err);
            },
            beforeAvatarUpload(file) {
                return Utils.limitUpdateFileSize(file, globalConfig.maxImageFileSize, this);
            },
        }
    };
</script>

<style>

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 180px !important;
        height: 180px;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar {
        width: 180px;
        height: 180px;
        display: block;
    }
</style>
