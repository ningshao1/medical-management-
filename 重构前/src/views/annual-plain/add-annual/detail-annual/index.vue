<template>
    <div class="detail-a">

        <div class="detail-index">
            <a href="javascript:;" class="print-annual" v-if="ViewLimit('annual:word')" @click="clickPrint">打印年度计划</a>
            <div class="step-box">
                <steps :data='step' :error="stepError" :current="currentStep"></steps>
            </div>
            <div>
                <oneStep :detail='true'></oneStep>
            </div>
            <div v-if="PlanDetail.approveType>4">
                <committee :detail='true' :ListData='ListData'></committee>
                <votes :data='voteObject' class="votes"></votes>
                <div v-if="PlanDetail.approveType>=6">
                    <div v-if="PlanDetail.approveType===6&&PlanDetail.hospitalType===2&&ViewLimit('annual:hospital')">
                        <editor-upload :max-size='3*1024*1024' :data='editorUploadData' v-model="FileCollection" :accept='[".doc", ".docx",".jpg",".png",".jpeg",".wps",".xls", ".xlsx"]' :editable='true' :downloadable='true'></editor-upload>
                    </div>
                    <fileList v-else :data='fileData'></fileList>
                </div>
                <div v-if="PlanDetail.approveType>=7">
                    <fileList :data='expert' :preview='false'></fileList>
                </div>
                <div v-if="PlanDetail.approveType>=7&&PlanDetail.unitExpertsType!==2">
                    <fileList :data='experts' :preview='false'></fileList>
                </div>
            </div>
            <print :data='detaiData' style="display:none" ref="print">
            </print>
            <div class="cancel-btn">
                <div>
                    <Button class="kld-btn" @click="$router.go(-1)">返回</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import oneStep from "../one-step/index.vue";
import committee from "../common/committee/index";
import reportApply from "../../add-annual-fifty/common/step-parts/report-apply";
import print from "./print-details/index";
import fileList from "./common/file-list";
import votes from "../../add-annual-fifty/common/finally-resolve";
import steps from "@common/step/step";
import upload from "../common/Editor-upload";

export default {
    data() {
        return {
            ListData: [],
            reportApplyData: {},
            voteType: 1,
            detaiData: {},
            fileData: {
                radio: {},
                file: {},
                imgUrl: [],
                note: {}
            },
            expert: {
                radio: {},
                file: {},
                note: {},
                imgUrl: []
            },
            experts: {
                radio: {},
                file: {},
                note: {},
                imgUrl: []
            },
            voteNote: "",
            voteObject: {},
            step: [
                "提交申请",
                "委员会讨论",
                "院部讨论",
                "卫计委讨论",
                "审批通过"
            ],
            stepError: false,
            FileCollection: []
        };
    },
    components: {
        oneStep,
        [committee.name]: committee,
        reportApply,
        print,
        fileList,
        votes,
        steps,
        [upload.name]: upload
    },
    created() {
        this.getDetail();
    },
    methods: {
        //详情获取
        getDetail() {
            this.$axios
                .get(`/annualPlanTmp/${this.$route.query.id}?type=${1}`)
                .then(({ data }) => {
                    this.$store.commit("SetPlanDetail", data);
                    this.detaiData = data;
                    this.ListData = data.annualPlanVote;
                    this.voteType = data.voteType;
                    this.reportApplyData = {
                        unitExpertsType: data.unitExpertsType,
                        departmentType: data.departmentType,
                        photos: data.photos,
                        approveType: data.approveType
                    };
                    this.voteObject = data;
                    this.voteNote = data.vote;
                    this.fileData = {
                        radio: {
                            title: "院部讨论意见：",
                            content: data.hospitalType
                        },
                        file: {
                            title: "院部讨论附件：",
                            content: data.hospitalFiles
                        },
                        imgUrl: data.hospitalPhotos,
                        note: {
                            title: "院部讨论备注：",
                            content: data.hospitalVote
                        }
                    };
                    this.testGET(data.hospitalFiles, data.hospitalPhotos);
                    this.expert = {
                        radio: {
                            title: "单位专家意见：",
                            content: data.unitExpertsType
                        },
                        file: { title: "单位专家附件：" },
                        imgUrl: data.unitExpertsPhotos,
                        note: {
                            title: "单位专家备注：",
                            content: data.unitExpertsVote
                        }
                    };
                    this.experts = {
                        radio: {
                            title: "卫计委专家意见：",
                            content: data.planningExpertsType
                        },
                        file: {
                            title: "卫计委专家附件："
                        },
                        imgUrl: data.planningExpertsPhotos,
                        note: {
                            title: "卫计委专家备注：",
                            content: data.planningExpertsVote
                        }
                    };
                });
        },
        clickPrint() {
            if (
                this.detaiData &&
                this.detaiData.sectionName &&
                this.detaiData.assetName
            ) {
                this.$refs["print"].print(
                    this.detaiData,
                    `${this.detaiData.sectionName}：${
                        this.detaiData.assetName
                    }设备配置论证表`
                );
            } else {
                this.$refs["print"].print(this.detaiData);
            }
        },
        clickPrints() {
            this.$axios.post(`test/iii`).then(res => {
                console.log(res);
            });
        },
        testGET(fileData, imgData) {
            fileData instanceof Array &&
                fileData.map(v => {
                    if (v !== null) {
                        this.$axios
                            .get(v.fileUrl, {
                                responseType: "blob"
                            })
                            .then(({ data }) => {
                                let file = new File([data], v.fileName, {});
                                this.FileCollection.push(file);
                            });
                    }
                });
            imgData instanceof Array &&
                imgData.map(v => {
                    if (v !== null) {
                        this.$axios
                            .get(v.photoUrl, {
                                responseType: "blob"
                            })
                            .then(({ data }) => {
                                let file = new File(
                                    [data],
                                    v.photoUrl.match(/.*\/(.*?)$/)[1],
                                    {}
                                );
                                this.FileCollection.push(file);
                            });
                    }
                });
        }
    },
    computed: {
        currentStep() {
            const {
                unitExpertsType,
                approveType,
                planningExpertsType
            } = this.PlanDetail;
            switch (approveType - 0) {
                case 2:
                case 3:
                    return 0;
                case 5:
                    this.stepError = true;
                    return 1;
                case 6:
                    this.stepError = true;
                    return 2;
                case 9:
                    return this.step.length;
                case 10:
                    this.stepError = true;
                    if (
                        unitExpertsType === "2" ||
                        planningExpertsType === "2"
                    ) {
                        return 3;
                    } else {
                        return 4;
                    }
            }
        },
        editorUploadData() {
            return {
                hospitalType: this.detaiData.hospitalType,
                hospitalVote: this.detaiData.hospitalVote
            };
        },
        PlanDetail() {
            console.log(this.$store.state.PLAN_DETAIL.PlanDetail);
            return this.$store.state.PLAN_DETAIL.PlanDetail || {};
        }
    }
};
</script>
<style lang="less" scoped>
.detail-a {
    background: #fafafa;
    border: solid 1px rgba(2, 31, 57, 0.1);
    border-radius: 3px;
}
.detail-index {
    padding: 20px 20px;
    position: relative;
}
.print-annual {
    position: absolute;
    top: -53px;
    right: 0;
    text-decoration: underline;
    font-size: 13px;
}
.result {
    font-size: 16px;
    color: #f2740c;
    & + span {
        font-size: 14px;
    }
}
.cancel-btn {
    height: 80px;
    background-color: rgba(210, 210, 210, 0.5);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
}
/deep/.report {
    .fifty-report-apply {
        padding: 0;
    }
}
.file-list-title {
    color: #f2740c;
    font-size: 14px;
    padding-bottom: 5px;
}
/deep/.votes {
    padding: 0 !important;
    margin-bottom: 10px;
    .ivu-form-item-label {
        color: #f2740c;
    }
    .ivu-form-item-content {
        > span {
            color: #020e0f !important;
        }
    }
}
.step-box {
    background-color: #fff;
    -webkit-border-radius: 3px;
    border-radius: 3px;
}
</style>

