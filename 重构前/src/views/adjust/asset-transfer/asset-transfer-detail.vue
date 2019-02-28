<template>
    <div class="ATD-wrap container-fluid">
        <div class="ATD-basic-info-wrap row">
            <kld-type :title="'基础信息'"></kld-type>
            <div class="ATD-basic-info">
                <h3>设备名称：{{transferDetail.assetName}}</h3>
                <div class="ATD-basic-detail">
                    <p>
                        <span>设备编码</span>：{{transferDetail.assetCode}}
                    </p>
                    <p>
                        <span>设备序列号</span>：{{transferDetail.assetSN}}
                    </p>
                    <p>
                        <span>设备品牌</span>：{{transferDetail.brandName}}
                    </p>
                    <p>
                        <span>设备型号</span>：{{transferDetail.assetClass}}
                    </p>
                    <p>
                        <span>所在科室</span>
                        <span>：{{transferDetail.osName}}</span>
                    </p>
                    <!-- <p>
                        <span>院内分类</span>
                        <span>：{{transferDetail.typeName}}</span>
                    </p> -->
                </div>

            </div>
        </div>

        <div class="ATD-transfer-info-wrap">
            <kld-type :title="'设备转移验收信息'"></kld-type>
            <h3>验收项：<span style="color:#e7485a" v-if="!accepted">*</span></h3>

            <div class="acceptance-info" v-if="!accepted">
                
                <RadioGroup v-model="v.selectedValue" v-for="(v,i) of acceptanceInfo" :key="i" class="acceptance-step">
                    <div class="option-wrap">

                        <div>{{v.title}}</div>
                        <div>
                            <Radio :label="0" >
                                <span :style="!v.selectedValue?'color:#111111;font-weight: bold;':''">正常</span>
                            </Radio>
                        </div>
                        <div>
                            <Radio :label="1" >
                                <span :style="v.selectedValue?'color:#111111;font-weight: bold;':''">不正常</span>
                            </Radio>
                        </div>
                    </div>
                </RadioGroup>
                
            </div>


            <div class="show-info" v-else>
                <p>
                    <span>开关机是否正常：</span>
                    <span>{{transferDetail.acceptanceRuleOne==1?"不正常":"正常"}}</span>
                </p>
                <p>
                    <span>设备功能是否正常：</span>
                    <span>{{transferDetail.acceptanceRuleTwo==1?"不正常":"正常"}}</span>
                </p>
                <p>
                    <span>借出设备附件是否齐全：</span>
                    <span>{{transferDetail.acceptanceRuleThree==1?"不正常":"正常"}}</span>
                </p>
            </div>

            <h3>备 注：</h3>
            <i-input type="textarea" :rows="4" v-model="transferDetail.acceptanceNote" :disabled="accepted"></i-input>
        </div>




        <div class="ATD-transfer-wrap row">
            <kld-type :title="'设备转移记录'"></kld-type>
            <div class="ATD-transfer">
                <div class="ATD-transfer-step ATD-transfer-step-complete" v-if="accepted">
                    <i></i>
                    <div>
                        <p><span>已完成</span></p>
                    </div>
                </div>
                <div :class="isAccept">
                    <i></i>
                    <div>
                        <p>
                            <span v-if="!accepted" style="color:#e7485a;">未验收</span> 
                            <span v-else >已验收</span> 
                            <span v-if="accepted">{{transferDetail.acceptanceTime | dateFormat}}</span>
                        </p>
                        <poptip-show-info v-if="accepted" :info-id="transferDetail.acceptanceId">
                            <p>验收人：{{transferDetail.acceptanceName}}</p>
                        </poptip-show-info>
                    </div>
                </div>
                <div class="ATD-transfer-step ATD-transfer-step-complete">
                    <i></i>
                    <div>
                        <p><span>设备转移</span>： {{transferDetail.oldSectionName}} --> {{transferDetail.sectionName}} &nbsp;&nbsp;&nbsp;{{transferDetail.applyTime | dateFormat}}</p>
                        <poptip-show-info :info-id="transferDetail.handleId">
                            <p>操作人：{{transferDetail.handleName}}</p>
                        </poptip-show-info>
                    </div>
                </div>
            </div>
        </div>


        <div class="ATD-footer row">
            <Button style="width:75px;" class="footer-button" @click="$router.go(-1)">返回</Button>
            <Button type="primary" class="footer-button" :loading="loading" @click="doAccept" v-if="!accepted&&ViewLimit('section:acceptance')&&Object.keys(transferDetail).length">验收</Button>
        </div>



        <!-- <Modal title="设备转移验收" v-model="acceptance" class="ATD-modal" width="800px">
            <div class="ATD-modal">
                <h3>请确认以下信息</h3>
                <div class="acceptance-info">
                    
                    <RadioGroup v-model="v.selectedValue" v-for="(v,i) of acceptanceInfo" :key="i" class="acceptance-step">
                        <div class="option-wrap">

                            <div>{{v.title}}</div>
                            <div>
                                <Radio :label="1" >
                                    <span :style="v.selectedValue?'color:#111111;font-weight: bold;':''">正常</span>
                                </Radio>
                            </div>
                            <div>
                                <Radio :label="0" >
                                    <span :style="!v.selectedValue?'color:#111111;font-weight: bold;':''">不正常</span>
                                </Radio>
                            </div>
                        </div>
                    </RadioGroup>
                    
                </div>

                <h3>备注</h3>
                <i-input type="textarea" :rows="4" style="margin-top:16px;" placeholder="请填写备注信息"></i-input>
            </div>
            <div slot="footer">
                <Button style="width:75px;" @click="acceptance=false">取消</Button>
                <Button type="primary" @click="doAcceptance">确认</Button>

            </div>
        </Modal> -->

    </div>
</template>

<script>
import kldType from '@common/kld-type/kld-type.vue';
import kldConfirm from '@common/kld-confirm';
import poptipShowInfo from '@common/poptip-show-info';
export default {
    data(){
        return {
            loading:false,
            transferInfoRemarks:"",
            // acceptance:false,
            acceptanceInfo:[
                {
                    title:'开关机是否正常：',
                    selectedValue:0
                },
                {
                    title:'设备功能是否正常：',
                    selectedValue:0
                },
                {
                    title:'借出设备附件是否正常：',
                    selectedValue:0
                },
            ],
            transferId:this.$route.query.id,
            transferDetail:{

            },
        }
    },
    computed:{
        isAccept(){
            return {
                "ATD-transfer-step":true,
                "ATD-transfer-step-complete":this.accepted
            }
        },
        accepted(){
            return this.transferDetail.acceptanceType==1
        }
    },
    filters:{
        dateFormat(data){
            return new Date(+data).toLocaleString('zh',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\//g,"-")
        }
    },
    created() {
        this.getOriginData()
    },
    components:{
        kldType,
        poptipShowInfo
    },
    methods:{
        getOriginData(){
            this.$axios.get(`/assetBorrow/acceptance/${this.transferId}`)
                .then(res=>{
                    this.transferDetail=res.data
                })
        },
        doAcceptance(){
            this.acceptance=false;
        },
        doAccept(){

            kldConfirm({
                title: '提示',
                content: '确认验收？',
                maskClosable: false,  //是否允许点击遮罩关闭 默认:false
               
                ok:()=> {                //当点击了确认按钮时
                    this.doSubmit()
                },
                cancel:()=> {            //取消按钮同上
                    console.log('cancel');
                }
            });

            
        },
        doSubmit(){
            this.loading=true
            this.$axios.put(`/assetBorrow/updateAssetTransferByAcceptance`,{
                id:this.transferId,
                acceptanceNote:this.transferDetail.acceptanceNote||"",
                acceptanceRulesOne:this.acceptanceInfo[0].selectedValue,
                acceptanceRulesTwo:this.acceptanceInfo[1].selectedValue,
                acceptanceRulesThree:this.acceptanceInfo[2].selectedValue,
                sectionId:this.transferDetail.sectionId,
                assetId:this.transferDetail.assetId,
            }).then(
                res=>{
                    this.$Message.success("转移设备验收成功！");
                    this.loading=false;
                    this.$store.state.reload();
                },
                error=>{
                    this.loading=false;
                }
            )
        }
    }
    
}
</script>


<style lang="less" >
@import url('./asset-transfer-detail.less');
</style>