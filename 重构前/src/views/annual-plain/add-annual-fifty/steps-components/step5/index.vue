<template>
    <div class="annual-fifty-step3">
        <file-list v-if="isDetail" :data="workerFile" style="padding: 20px;"></file-list>
        <worker-vote v-else ref="court-vote"></worker-vote>
    </div>
</template>

<style scoped lang="less">
    .ivu-form{
        /deep/.ivu-form-item-label{
            font-size: 14px;
        }
    }
</style>

<script>
    import WorkerVote from '../../common/worker-vote';
    import FileList from "../../../add-annual/detail-annual/common/file-list";
    export default {
        name:'annual-fifty-step4',
        components:{FileList, WorkerVote},
        props: {
            data: {type: Object},
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {

            }
        },
        computed: {
            workerFile() {
                if (this.data) {
                    const {workeType: radio, workVote: note, workFiles: files, workPhotos: photos} = this.data.annualPlanMore;
                    return {
                        radio: {
                            title: '职工大会表决意见',
                            content: radio
                        },
                        note: {
                            title: '职工大会表决备注',
                            content: note
                        },
                        file: {
                            title: '职工大会表决附件',
                            content: files
                        },
                        imgUrl: photos
                    }
                }
            }
        },
        methods:{
            submit() {
                this.$refs['court-vote'].postData();
            }
        }
    }
</script>


