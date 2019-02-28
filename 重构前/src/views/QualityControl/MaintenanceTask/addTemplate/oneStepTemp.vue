<template>
    <div>
        <div class='bisInfo' style="padding:0 30px;">
            <div class="temp_title">
                基础信息
            </div>
            <div class="temp_list">
                <div class="temp_">
                    <div>
                        <div class='temp_fields'>
                            模板名称
                            <span style="color: #fe881a;">*</span>
                        </div>
                        <div class='temp_input'>
                            <Input :disabled='tplBan' v-model.trim="values.mName" />
                        </div>
                    </div>
                    <div>
                        <div class='temp_fields'>
                            保养级别
                            <span style="color: #fe881a;">*</span>
                        </div>
                        <div class='temp_input'>
                            <Input disabled :value="values.mMaintenanceLevel==1?'一级保养':'二级保养'" />
                        </div>

                    </div>
                </div>
                <div class="temp_">
                    <div>
                        <div class='temp_fields'>
                            制定人
                        </div>
                        <poptip-show-info :info-id="values.customId" width="100%">
                            <div class='temp_input'>
                                <Input disabled v-model="values.customName" />
                            </div>
                        </poptip-show-info>
                    </div>
                    <div>
                        <div class='temp_fields'>
                            制定时间
                        </div>
                        <div class='temp_input'>
                            <Input disabled :value="values.createTime" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import poptipShowInfo from '@common/poptip-show-info';

    export default {
        components: {poptipShowInfo},
    props:{
        //默认输入的信息
        value:{
            default(){
                return {
                    mName:'testName',
                    mMaintenanceLevel:1,
                    customName:'testUser',
                    createTime:new Date().toLocaleString('zh',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\//g,"-")
                }
            }
        },
        //禁止模板名称
        tplBan:{
            type:Boolean,
            default(){
                return false;
            }
        }

    },
    data() {

        return {
            list: null,
            // username:JSON.parse(localStorage.getItem('user_in')).loginName,
            // time:Date.now()
        };
    },
    computed: {
        values: {
            get() {
                return this.value;
            },
            set(data) {
                this.$emit("update:value", data);
            }
        }
    }
};
</script>
<style lang="less" scoped>
.temp_title {
    font-size: 14px;
    font-weight: normal;
    line-height: 40px;
    font-stretch: normal;
    color: #f2740c;
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 15px;
    //background-color: #e2e2e2;
}
.temp_list {
    //每一行
    .temp_ {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        > div {
            width: 50%;
            .temp_input{
                padding-bottom: 10px;
            }
            .temp_fields{
                font-size: 12px;
                padding-bottom: 10px;
            }
        }
        > div:nth-of-type(even) {
            padding-left: 10px;
        }
        > div:nth-of-type(odd) {
            padding-right: 10px;
        }
    }
}
</style>
