<template>
    <div class="rae-wrap container-fluid">
        <div class="step-wrap row">
            <Step :data="stepGroup" :current="step-1"></Step>
        </div>
        <div class="input-wrap row">
            <div class="input-content container">
                <transition name="fade" mode="out-in">
                    <component ref="step-component" :is="componentId" v-model="stepsData"></component>
                </transition>
            </div>
            <div class="toggle-step row">
                <div class="container toggle-button-wrap">
                    <Button class="kld-btn last-step" type="default" @click="goBack" v-if="step===1" style="background-color:#a9a8a9;border: solid 1px #999999;">取 消</Button>
                    <Button class="kld-btn last-step" @click="toggleStep(-1)" v-else>上一步</Button>
                    <Button v-if="step!==4" class="kld-btn next-step" @click="toggleStep(1)">下一步</Button>
                    <Button v-else :loading="submitLoading" class="kld-btn next-step" @click="submitEvent">提交报告</Button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import stepOne from './stepOne'
    import stepTwo from './stepTwo'
    import stepThree from './stepThree'
    import stepFour from './stepFour'
    import Step from '../../../../common/step/step'
    import kldConfirm from '@common/kld-confirm';
    import emptyToNull from '@common/empty-to-null';

    export default {
        data() {
            return {
                submitLoading: false,
                componentGroup: [
                    "stepOne",
                    "stepTwo",
                    "stepThree",
                    "stepFour"
                ],
                step: 1,
                stepGroup: [
                    "基础信息",
                    "不良事件情况",
                    "医疗器械情况",
                    "关联性评价"
                ],
                test: 1,
                stepsData: {
                    //第一步数据
                    aeReportDate: new Date(),
                    aeCode: '',
                    aeReportSource: '',
                    unitName: '',
                    unitAddress: '',
                    unitZipCode: '',
                    unitPhone: '',
                    patientName: '',
                    patientAge: '',
                    patientPhone: '',
                    patientBirthday: '',
                    patientSex: '',
                    desiredResult: '',

                    //第二步数据
                    aeMechanicalFailure: '',
                    aePrimaryLesion: '',
                    aeOccurrenceDate: '',
                    aeDiscoveryDate: '',
                    aeUsePlace: '',
                    userPlaceMemo: '',
                    aeConseQuence: '',
                    deathDate: '',
                    aeState: '',

                    //第三步数据
                    productId: '',
                    sectionId: '',
                    commodityName: '',
                    registrationNumber: '',
                    enterpriseName: '',
                    enterpriseAddress: '',
                    enterprisePhone: '',
                    productBatchCode: '',
                    operator: '',
                    operatorMome: '',
                    effectiveDate: '',
                    porductDate: '',
                    stopUseDate: '',
                    implantationDate: '',
                    aeAnalysis: '',
                    aeHandle: '',
                    aeReportStatus: '',

                    //第四步数据
                    timeSequence: '',
                    lesionType: '',
                    deviceFactors: '',
                    evaluationResult: '',
                    reporter: '',
                    photos: []
                },

            }
        },
        //当路由进入时清除缓存
        beforeRouteEnter(to, from, next) {
            sessionStorage.removeItem('__reportAdverseEvent__deviceName__');
            sessionStorage.removeItem('__reportAdverseEvent__deviceClass__');
            sessionStorage.removeItem('__reportAdverseEvent__deviceCode__');
            next();
        },

        methods: {
            goBack() {
                kldConfirm({
                    title: '提示',
                    content: '取消后已填数据不会保存，确定取消吗？',
                    ok: () => {
                        this.$router.go(-1);
                    }
                });
            },
            toggleStep(step) {
                if (step > 0) {
                    this.$refs['step-component'].validate(valid => {
                        if (valid) this.step += step;
                    });
                } else {
                    this.step += step;
                }
            },
            doSubmit(){
                const config = {headers: {'Content-Type': 'multipart/form-data'}};

                this.submitLoading = true;
                Promise.all(
                    this.stepsData.photos.map(img => {
                        const data = new FormData();
                        data.append('file', img);

                        return this.$axios.post(`/photo/${this.user_in.osId}/8/upload`, data, config);
                    })
                )
                    .then(
                        allRes => {
                            const photos = allRes.map(res => res.data);

                            return this.$axios.post('/adverseEvent', emptyToNull({...this.stepsData, photos}));
                        },
                        error => {
                            this.$Message.warning('图片上传失败');
                            return Promise.reject(error);
                        }
                    )
                    .then(() => {
                        this.$Message.success('不良事件上报成功');
                        this.$router.push({name: 'adverse-event-list'});
                    })
                    .finally(() => this.submitLoading = false);
            },
            submitEvent() {
                this.$refs['step-component'].validate(valid => {
                        if (valid){
                            this.doSubmit();
                        }
                });
            }
        },
        computed: {
            componentId() {
                // return this.componentGroup[2];
                return this.componentGroup[this.step - 1];
            },
            user_in() {
                return this.$store.state.user_in;
            }
        },
        components: {
            stepOne,
            stepTwo,
            stepThree,
            stepFour,
            Step
        }

    }
</script>

<style lang="less">
    .rae-wrap {

        .step-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60px;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
        }
        .input-wrap {
            margin-top: 20px;
            padding-top: 1px;
            background-color: #fafafa;
            border-radius: 3px;
            .input-content {
                margin: 0 auto 20px;
            }
            .toggle-step {
                height: 80px;
                background-color: rgba(210, 210, 210, 0.5);
                border-radius: 0px 0px 3px 3px;
                display: flex;
                align-items: center;
                .toggle-button-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .last-step {
                        margin-right: 20px;
                        /*background-color: #a9a8a9;*/
                        /*border-color: #a9a8a9;*/
                    }
                }

            }
        }
    }
</style>
