<template>
    <div class="acceptance-two-step">
        <Form ref="form" label-position='top' :model="formFakeData" :rules="formRules">
            <div class='ac-two-block ac-two-block-first'>
                <FormItem label="设备采购论证会议纪要：" prop="name">
                    <kld-upfile :fileList="files.meetingFiles" :second='meeting' :accept='["doc", "docx","txt","xls","xlsx","wps"]' maxCount='infinity'></kld-upfile>
                </FormItem>
            </div>
            <div class='ac-two-block'>
                <FormItem label="标书：" prop="name">
                    <kld-upfile :fileList="files.bidingFiles" :second='biding' :accept='["doc", "docx","jpg","png","jpeg","xls","xlsx","wps"]' maxCount='infinity'></kld-upfile>
                </FormItem>
            </div>

            <div class='ac-two-block'>
                <Row :gutter="20">
                    <Col span="12">
                    <FormItem label="安装科室：" prop="sectionName">
                        <i-input :value="Nasset.sectionName" readonly class="kld-input"></i-input>
                        <!--<div class='add-os'>-->
                        <!--<Poptip width="100%" class="section-tree" trigger="click" placement="bottom">-->
                        <!--<div slot="content">-->
                        <!--<OS-Tree ></OS-Tree>-->
                        <!--</div>-->
                        <!--</Poptip>-->
                        <!--</div>-->
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="安装时间：" prop="installDate">
                        <i-input :value="Nasset.collarTime" readonly class="kld-input"></i-input>
                        <!--<DatePicker :editable="false" class="kld-date-picker" type="date" placeholder="请选择安装时间"></DatePicker>-->
                    </FormItem>
                    </Col>
                </Row>
            </div>
            <div class='ac-two-block'>
                <FormItem label="设备安装要求：">
                    <kld-upfile :accept='["doc", "docx","xls","xlsx","wps","txt"]' :fileList="files.installFiles" :second='install' maxCount='infinity'></kld-upfile>
                </FormItem>
            </div>
            <div class='ac-two-block'>
                <FormItem label="设备确认文件：">

                    <!-- <kld-upfile :accept='["doc", "docx","xls","xlsx","wps","txt"]' :fileList="files.notarizeFiles" :second='notarize' maxCount='infinity'></kld-upfile> -->
                    <kld-upfile :accept='["doc", "docx","xls","xlsx","wps","txt","jpg","png","jpeg"]' :fileList="files.notarizeFiles" :second='notarize' maxCount='infinity'></kld-upfile>
                    <!--//TODO操作规程-->
                </FormItem>
            </div>
            <div class='ac-two-block train-div'>
                <div class="train-checkbox">
                    <Checkbox v-model="trainWordType">已完成使用培训</Checkbox>
                </div>
                <FormItem label="使用培训：">
                    <kld-upfile :accept='["doc", "docx","jpg","png","jpeg","wps","xls", "xlsx"]' :fileList="files.trainFiles" :second='train' maxCount='infinity'></kld-upfile>
                </FormItem>
            </div>
            <div class='ac-two-block'>
                <!--//TODO操作规程-->
                <FormItem label=" 操作规程" prop="handleFiles">
                    <kld-upfile :second='procedure' :accept='["doc", "docx","jpg","png","jpeg","wps","xls", "xlsx"]' :fileList='files.handleFiles' maxCount='infinity'></kld-upfile>
                </FormItem>
            </div>
            <div class='ac-two-block'>
                <FormItem label=" 安装验收报告：" prop="receiveFiles">
                    <kld-upfile :second='receive' :accept='["doc", "docx","jpg","png","jpeg","wps","xls", "xlsx"]' :fileList='files.receiveFiles' maxCount='infinity'></kld-upfile>
                </FormItem>
            </div>
        </Form>
        <div class='ac-two-foot'>
            <div class='foot-title'>
                <span>*</span> 温馨提示：</div>
            <div class='foot-content'>
                本模块支持上传文档类型：<img :src=' require("@common/C-UploadFile/image/word.png")' alt="">doc，docx；<img :src=' require("@common/C-UploadFile/image/excel.png")' alt="">xls，xlsx；<img :src='require("@common/C-UploadFile/image/pict.png")' alt="">jpg，png,jpeg；单个文件大小为3M以内。
            </div>
        </div>
        <!--<Button @click="next">test</Button>-->
    </div>
</template>
<script>
import upfile from "@common/C-UploadFile/CUploadFile.vue";
// import OSTree from '@common/trees/tree'
export default {
    name: "step2",
    props: {
        Nasset: {
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            trainWordType: false,
            meeting: {
                show: false,
                title: "会议纪要",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png")
                ]
            },
            biding: {
                show: false,
                title: "标书文件",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png"),
                    require("@common/C-UploadFile/image/pict.png")
                ]
            },
            install: {
                show: false,
                title: "设备安装要求",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png")
                ]
            },
            notarize: {
                show: false,
                title: "安装确认文件",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png"),
                    require("@common/C-UploadFile/image/pict.png")
                ]
            },
            receive: {
                show: false,
                title: "安装验收报告",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png"),
                    require("@common/C-UploadFile/image/pict.png")
                ]
            },
            procedure: {//TODO
                show: false,
                title: "操作规程",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png"),
                    require("@common/C-UploadFile/image/pict.png")
                ]
            },
            train: {
                show: false,
                title: "使用培训",
                icon: [
                    require("@common/C-UploadFile/image/word.png"),
                    require("@common/C-UploadFile/image/excel.png"),
                    require("@common/C-UploadFile/image/pict.png")
                ]
            },
            formFakeData: {
                sectionName: true,
                installDate: true,
                receiveFiles: ""
            },
            formRules: {
                sectionName: {
                    required: true
                },
                installDate: {
                    required: true
                },
                receiveFiles: {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (this.files.receiveFiles.length > 0) {
                            callback();
                        } else {
                            this.$Message.warning("请上传安装验收报告");
                            callback(new Error("安装验收报告必须上传"));
                        }
                    }
                }
            },
            files: {
                meetingFiles: [],
                bidingFiles: [],
                installFiles: [],
                notarizeFiles: [],
                receiveFiles: [],
                trainFiles: [],
                handleFiles:[]//TODO
            }
        };
    },
    computed: {
        user_in() {
            return this.$store.state.user_in;
        }
    },
    watch: {
        "files.receiveFiles"() {
            this.$refs.form.validateField("receiveFiles");
        }
    },
    methods: {
        next(callback) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const uploadConfig = {
                            headers: {
                                "content-type": "multipart/form-data"
                            }
                        },
                        files = this.files,
                        assetId = this.Nasset.NassetId,
                        acceptPhotos = [],
                        bidingPhotos = [],
                        trainPhotos = [],
                        confirmPhotos=[],//TODO
                        handlePhotos=[],//TODO
                        otherFile = [];

                    for (const key of Object.keys(files)) {
                        let uploadType = "";
                        switch (key) {
                            case "meetingFiles":
                                uploadType = "1";
                                break;
                            case "bidingFiles":
                                uploadType = "2";
                                break;
                            case "installFiles":
                                uploadType = "3";
                                break;
                            case "notarizeFiles":
                                uploadType = "4";
                                break;
                            case "receiveFiles":
                                uploadType = "5";
                                break;
                            case "trainFiles":
                                uploadType = "6";
                                break;
                            case "handleFiles":
                                uploadType='7';
                                break;
                        }

                        for (const file of files[key]) {
                            const formData = new FormData();
                            formData.append("file", file);
                            if (/image/.test(file.type)) {
                                if (key === "bidingFiles") {
                                    bidingPhotos.push(
                                        this.$axios.post(
                                            `/photo/${
                                                this.user_in.osId
                                            }/12/upload`,
                                            formData,
                                            uploadConfig
                                        )
                                    );
                                } else if (key === "trainFiles") {
                                    trainPhotos.push(
                                        this.$axios.post(
                                            `/photo/${
                                                this.user_in.osId
                                            }/14/upload`,
                                            formData,
                                            uploadConfig
                                        )
                                    );
                                } else if(key === "receiveFiles") {
                                    acceptPhotos.push(
                                        this.$axios.post(
                                            `/photo/${
                                                this.user_in.osId
                                            }/11/upload`,
                                            formData,
                                            uploadConfig
                                        )
                                    );
                                }else if(key==='notarizeFiles'){//TODO
                                    confirmPhotos.push(
                                        this.$axios.post(
                                            `/photo/${
                                                this.user_in.osId
                                            }/19/upload`,
                                            formData,
                                            uploadConfig
                                        )
                                    );
                                }else if(key==='handleFiles'){//TODO
                                    handlePhotos.push(
                                        this.$axios.post(
                                            `/photo/${
                                                this.user_in.osId
                                            }/20/upload`,
                                            formData,
                                            uploadConfig
                                        )
                                    );
                                }
                            } else {
                                otherFile.push(
                                    this.$axios.post(
                                        `/fileUplod/${
                                            this.user_in.osId
                                        }/upload/${assetId}?type=${uploadType}`,
                                        formData,
                                        uploadConfig
                                    )
                                );
                            }
                        }
                    }

                    Promise.all([
                        Promise.all([
                            Promise.all(acceptPhotos),
                            Promise.all(bidingPhotos),
                            Promise.all(trainPhotos),
                            Promise.all(confirmPhotos),//TODO
                            Promise.all(handlePhotos),//TODO
                        ]).then(
                            ([
                                acceptPhotosRes,
                                bidingPhotosRes,
                                trainPhotosRes,
                                confirmPhotoRes,
                                handlePhotosRes
                            ]) =>
                                this.$axios.post("/assetacceptance/savefile", {
                                    assetId,
                                    assetAcceptPhoto: acceptPhotosRes.map(
                                        res => res.data
                                    ),
                                    tenderBookPhoto: bidingPhotosRes.map(
                                        res => res.data
                                    ),
                                    trainWordPhoto: trainPhotosRes.map(
                                        res => res.data
                                    ),
                                    trainWordType:
                                        this.trainWordType === true ? 1 : 0,
                                    confirmPhoto:confirmPhotoRes.map(//TODO
                                        res => res.data
                                    ),
                                    handlePhoto:handlePhotosRes.map(//TODO
                                        res => res.data
                                    ),
                                })
                        ),
                        Promise.all(otherFile)
                    ]).then(() => {
                        this.$Message.success("上传成功");
                        callback && callback();
                    });
                }
            });
        }
    },
    components: {
        [upfile.name]: upfile
        // [OSTree.name]:OSTree
    }
};
</script>
<style lang="less" scoped>
/deep/.ac-two-block {
    margin: 18px 0;
    &:first-of-type {
        padding-top: 10px;
    }
    .ivu-form-item-label {
        font-size: 13px;
        color: #000000;
    }
    .add-os {
        display: flex;
        justify-content: space-between;
        .ivu-btn {
            margin-left: 15px;
        }
    }
    .kld-date-picker {
        width: 100%;
    }
    .section-tree {
        width: 100%;
        > .kld-input {
            width: 100%;
        }
        .ivu-poptip-rel {
            width: 100%;
        }
        .ivu-poptip-popper {
            width: 100%;
            left: 0 !important;
        }
        .ivu-poptip-body-content {
            overflow-x: hidden;
        }
    }
}
.train-div {
    position: relative;
}
.train-checkbox {
    position: absolute;
    top: -3px;
    left: 80px;
}
.ac-two-foot {
    > .foot-title {
        color: #000000;
        span {
            color: #f2740c;
        }
    }
    .foot-content {
        color: #666666;
        img {
            width: 23px;
            vertical-align: middle;
            margin-right: 5px;
        }
    }

    margin-bottom: 10px;
}
</style>

