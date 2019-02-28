<template>
    <div class='OnetplDetails'>

        <div class='basicsInfo'>
            <basicsInfo :value='basicsData' :tplBan='true'></basicsInfo>
        </div>
        <div id='elementInfo'>
            <elementInfo :CheckCategoryList='elementData'></elementInfo>
        </div>
        <div class='tpl_Btn'>
            <span @click="back">返回</span>
            <span @click='edit' v-if="ViewLimit('pm:maintain:model:edit')">编辑</span>
        </div>
    </div>
</template>
<script>
import basicsInfo from "../../addTemplate/oneStepTemp.vue";
import elementInfo from "../../addTemplate/TwoStepTemp.vue";
export default {
    data() {
        return {
            list: null,
            basicsData: {},
            elementData: []
        };
    },
    components: {
        basicsInfo,
        elementInfo
    },
    methods: {
        //触发返回事件
        back() {
            this.$router.go(-1);
        },
        //编辑事件
        edit() {
            this.$router.push({name:"configOneTemplate",query:{id:this.$route.query.id}})
        },
        //根据id获得模板详情
        getDetail() {
            this.$axios
                .get(`/maintenanceModel/${this.$route.query.id}`)
                .then(res => {
                    const {
                        customName,
                        mName,
                        createTime,
                        mMaintenanceLevel
                    } = res.data;
                    this.basicsData = {
                        customName,
                        mName,
                        mMaintenanceLevel,
                        createTime
                    };
                    this.elementData = res.data.pmModelElementOptions;
                    console.log(this.elementData);
                    //    {mName:res.data.mName,mMaintenanceLevel:res.data.mMaintenanceLevel}
                })
                .catch(e => {
                    console.log(e);
                });
        }
    },
    created() {
        this.getDetail();
    }
};
</script>
<style lang="less" scoped>
.OnetplDetails {
    background-color: #fafafa;
    border-radius: 3px;
    border: solid 1px rgba(2, 31, 57, 0.1);
    .tpl_Btn {
        background-color: #e6e6e6;
        border-radius: 0px 0px 3px 3px;
        padding: 10px 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 25px;
        padding-right: 15px;
        span {
            width: 90px;
            height: 42px;
            color: #fff;
            font-size: 14px;
            line-height: 42px;
            text-align: center;
            cursor: pointer;
        }
        span:nth-of-type(1) {
            background-color: #a9a8a9;
            border-radius: 3px;
            border: solid 1px #999999;
            margin-right: 20px;
        }
        span:nth-of-type(2) {
            background-color: #22a1b9;
            border-radius: 3px;
            border: solid 1px #0c8399;
        }
    }
}
</style>
