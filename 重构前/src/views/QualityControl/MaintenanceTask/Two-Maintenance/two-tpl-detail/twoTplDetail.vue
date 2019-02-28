<template>
    <div class='TwotplDetails'>

        <div class='basicsInfo'>
            <basicsInfo :tplBan='true' :value="value"></basicsInfo>
        </div>
        <div>
            <equipmentInfo :outTreeData="outTreeData"></equipmentInfo>
        </div>
        <div id='elementInfo'>
            <elementInfo :CheckCategoryList="CheckCategoryList" :showDel="false"></elementInfo>
        </div>
        <div class='tpl_Btn'>
            <span @click="back">返回</span>
            <span @click='edit'>编辑</span>
        </div>
    </div>
</template>
<script>
import basicsInfo from "../../addTemplate/oneStepTemp.vue"; //基础信息
import equipmentInfo from "../add-two-tpl/TwoStepTemp.vue"; //保养设备分类
import elementInfo from "../../addTemplate/TwoStepTemp.vue"; //保养要素
export default {
    data() {
        return {
            list: null,
            value: {},
            checkList: [],
            outTreeData: [],
            CheckCategoryList: []
        };
    },
    components: {
        basicsInfo,
        elementInfo,
        equipmentInfo
    },
    created() {
        this.getTplDetail();
    },
    methods: {
        //触发返回事件
        back() {
            this.$router.go(-1);
        },
        //编辑事件
        edit() {
            this.$router.push({
                name: "configTwoTemplate",
                query: this.$route.query
            });
        },
        format(data) {
            this.value = {
                mName: data.mName,
                mMaintenanceLevel: data.mMaintenanceLevel,
                customName: data.customName,
                createTime: data.createTime.slice(0, 10)
            };
            this.outTreeData = data.assetTypes;
            this.CheckCategoryList = data.pmModelElementOptions;
        },
        getTplDetail() {
            this.$axios
                .get(`/maintenanceModel/${this.$route.query.id}`)
                .then(res => {
                    this.format(res.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
};
</script>
<style lang="less" scoped>
.TwotplDetails {
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
