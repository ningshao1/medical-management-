<template>
    <component
        :is="isCollapse ? 'kld-collapse' : 'div'"
        :class="{'annual-fifty-step4': ! isCollapse}"
        title="卫计委讨论"
    >
        <wjw-vote ref="wjw-vote" :data="data"></wjw-vote>
    </component>
</template>

<script>
import WjwVote from '../../common/wjw-vote';
import KldCollapse from '../../common/kld-collapse';
import FileList from "../../../add-annual/detail-annual/common/file-list";
export default {
    name:'annual-fifty-step4',
    components:{FileList, WjwVote, KldCollapse},
    props: {
        data: {
            type: Object
        },
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            result:null,
            reportApplyData:''
        }
    },
    methods:{
        submit() {
            this.$refs['wjw-vote'].postData();
        }
    }
}
</script>
<style lang="less" scoped>
    .ivu-form{
        /deep/.ivu-form-item-label{
            font-size: 14px;
        }
    }
</style>

