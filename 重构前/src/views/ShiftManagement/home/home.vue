<template>
    <div class="SM-home-wrap">
        <Button class="kld-btn" type="primary"  v-if="!pendingInfo&&showHandover"  @click="doHandOver">交 班</Button>
        <div class="turnOnDuty-wrap" v-if="pendingInfo">
            <div class="headImg">
                <img :src="imgUrl" alt="">
            </div>
            <div class="turn-content">
                <div class="for-welcome">
                    <h3>欢迎回到您的工作岗位</h3>
                    <p>现在是交接班时间，请认真核对交接设备是否正常，祝您工作顺利。</p>
                </div>
                <div class="for-info">
                    <p>交接班科室</p>
                    <span>{{pendingInfo.departmentName}}</span>
                </div>
                <div class="for-info">
                    <p>交班人</p>
                    <span>{{pendingInfo.watchkeeperName}}</span>
                </div>
                <div class="for-info">
                    <p>交班时间</p>
                    <span>{{pendingInfo.handTime}}</span>
                </div>
                <Button type="primary" class="kld-btn" @click="jumpSuccessionOrders(pendingInfo.shiftChangeId)">接班</Button>
            </div>
        </div>


        <Row type="flex"  align="middle" class="searchBar">
            <i-col >
                <DatePicker :editable="false" size="large" placeholder="选择日期" style="width:306px;" v-model="startTime" @on-change="doSearch"></DatePicker>
                <span style="font-size:14px;color:#666666;"> 至 </span>
                <DatePicker :editable="false" size="large" placeholder="选择日期" style="width:306px;" v-model="endTime" @on-change="doSearch"></DatePicker>
            </i-col>
            <i-col  style="margin-left:20px;">
                 <span style="font-size:14px;color:#666666;">交接人：</span>
                <poptip-show-info :info-id="userId">
                    <Select placeholder="选择交接人" size="large" v-model="userId" :disabled="!shiftPersons.length" @on-change="doSearch" style="width:306px;">
                        <Option :value="v.userId" v-for="(v,i) of shiftPersons" :key="i">{{v.userName}}</Option>
                    </Select>
                </poptip-show-info>
            </i-col>
            <i-col style="margin-left:50px;">
                <Button class="kld-btn" icon="ios-search" @click="doSearch">检索</Button>
                <Button class="kld-btn"  @click="doSearch(1,'reset')" style="width:75px;margin-left:10px;background-color:#aaa;border:none">重 置</Button>
            </i-col>
        </Row>

        <div class="container-fluid shift-list-show">
            <div class="shift-list-wrap">

                <table class="table-stripe">
                    <thead>
                        <tr>
                            <th style="width:10%">序号</th>
                            <th style="width:30%">交班时间</th>
                            <th style="width:30%">接班时间</th>
                            <th style="width:15%">交班人</th>
                            <th style="width:15%">接班人</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr v-for="(v,i) of shiftList.data" :key="'shiftList'+i" @click="jumpDetail(v.shiftChangeId)">
                            <td>{{i+1}}</td>
                            <td>{{v.handTime.replace(/\.0$/,"")}}</td>
                            <td>{{v.receiveTime.replace(/\.0$/,"")}}</td>
                            <td>
                                <poptip-show-info :info-id="v.watchkeeperId">{{v.watchkeeperName}}</poptip-show-info>
                            </td>
                            <td>
                                <poptip-show-info :info-id="v.successorId">{{v.successorName}}</poptip-show-info>
                            </td>
                        </tr>


                        <tr v-if="!shiftList.data.length">
                            <td colspan="5" style="text-align:center;">您所在科室暂无交接班记录</td>
                        </tr>
                    </tbody>
                </table>
                <div class="page-wrap">
                    <page :total="shiftList.recordsTotal" :current.sync="currentPage"  :pageSize="limit" @on-change="doSearch($event,'togglePage')"></page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import page from "@common/page/page.vue"
import poptipShowInfo from '@common/poptip-show-info';
export default {
    data(){
        return {
            imgUrl:require("../static/shift.png"),
            pendingInfo:null,//待接班信息
            showHandover:false,

            shiftPersons:[//其他人员列表
                {
                    userId:1,
                    userName:'李雷'
                }
            ],


            shiftList:{
                recordsTotal:0,
                data:[]
            },

            offset:0,
            limit:10,
            userId:"",
            startTime:"",
            endTime:'',


            currentPage:1,
            totalNum:0,

            ShiftListStatus:undefined,
            user_in:this.$store.state.user_in



        }
    },
    created(){
        this.getAllData();
        
    },
    computed:{

        postData(){
            return {//获取当前登录用户交接班列表信息请求数据
                offset:this.offset,
                limit:this.limit,
                params:{
                    userId:this.userId,
                    startTime:this.startTime?this.startTime.toLocaleString('zh',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\//g,"-"):"",
                    endTime:this.endTime?this.endTime.toLocaleString('zh',{year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\//g,"-")+" 23:59:59":"",
                    departmentId:this.$store.state.user_in.groupId
                }
            }
        }        
    },
    methods:{

        getAllData(){//获得初始数据
            //获得当前用户所在科室其他员工信息
            this.$axios.get('/shiftChange/getAllUser')
                .then(
                    res=>{
                        this.shiftPersons=res.data;
                    }
                )


            //获取当前登录用户待接班信息
            this.$axios.get('/shiftChange/pending')
                .then(
                    res=>{
                        this.pendingInfo=res.data||null;
                    }
                )


            //获取交接班记录列表
            this.doSearch();

            //是否显示交班按钮
            this.handleShiftList();
            
        },
        doSearch(page,type){
            if(type==="togglePage"){
                this.currentPage=+page;
                this.offset=(this.currentPage-1)*this.limit;
            }else if(type==="reset"){
                this.currentPage=1;
                this.offset=0;
                this.userId='';
                this.startTime='';
                this.endTime=''
            }else{
                this.currentPage=1;
                this.offset=0;
            }
            if(this.checkDate()){
                this.$axios.post('/shiftChange/queryList',this.postData).then(
                    res=>{
                        this.shiftList=res.data;   
                    }
                )
            }
        },
        //处理列表信息
        handleShiftList(){//待处理
        
                this.$axios.get("/shiftChange/allCount")
                .then(
                    res=>{
                        this.showHandover=res.data ? //是否为初始状态
                            res.data.receiveTime ? res.data.successorId==this.user_in.id : false//交班单是否被接
                            :
                            true;
                    }
                )

        },

        //日期选择校检
        checkDate(){
            if(this.startTime&&this.endTime&&(this.startTime>this.endTime)){
                
                this.$Message.error("起始时间不能大于终止时间");
                return false;
                
            }
            return true;
        },
        doHandOver(){
            if(!this.checkLimit('shiftchange:receive')){
                this.$Message.error('抱歉，您没有交班权限！');
                return 
            }

            this.$router.push({name:'handover'})
        },
        //跳转详情
        jumpDetail(id){
            this.$router.push({name:'shiftDetail',query:{id}})
        },
        //跳转接班单
        jumpSuccessionOrders(id){
            if(!this.checkLimit('shiftchange:delivery')){
                this.$Message.error("抱歉，您没有接班权限！");
                return 
            }
            this.$router.push({name:'successionOrders',query:{id}})
        }
        
    },
    components:{
        page,
        poptipShowInfo
    }
    
}
</script>

<style lang="less" scoped>
    .SM-home-wrap{
        position: relative;
        width: 100%;
        >.kld-btn{
            position: absolute;
            top:-67px;
            right: 23px;
            width:120px;
            font-size:14px;
        }
        .turnOnDuty-wrap{
            width: 100%;
            height: 88px;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            display: flex;
            flex-flow: row nowrap;
            margin-bottom:25px;
            >.headImg{
                width: 88px;
                height: 88px;
                background-color: #459ca2;
                flex-shrink: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                >img{
                    width: 50px;
                }
            }
            >.turn-content{
                flex-grow: 1;
                height:100%;
                padding:0 20px;
                display:flex;
                justify-content: space-between;
                align-items: center;
                >.for-welcome{
                    min-width:360px;
                    >p{
                        width: 100%;
                        
                        font-size: 14px;
                        color: #a9a8a9;
                    }
                }
                >.for-info{
                    >p{
                        
                        font-size: 14px;
                        color: #666666;
                    }
                    >span{
                        
                        font-size: 16px;
                        color: #020e0f;
                    }
                }
            }
        }
        .searchBar{
                height: 110px;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                padding: 0 20px;
                margin-bottom:20px;
                .kld-btn{
                    height:34px;
                    padding:0px 15px;
                }
        }
        .shift-list-show{
            width: 100%;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            padding:0 30px;
            .shift-list-wrap{
                >table{
                    width:100%;
                    border-collapse:collapse;
                    tr{
                        border-bottom:2px solid #f3f3f3;
                        th{
                            height:55px;
                            text-align: left;
                            
                            font-size: 14px;
                            color: #666666;
                        }
                        td{
                            height: 55px;
                            
                            font-size: 14px;
                            color: #666666;
                        }
                    }
                    tbody tr{
                        cursor: pointer;
                    }
                }
                .page-wrap{
                    display: flex;
                    justify-content: center;
                    margin:20px 0;
                    
                }
            }
        }
    }
</style>
