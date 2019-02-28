<template>
<div class="employee-wrap clearFix">
    <!-- 左侧质量控制任务列表 -->
    <div :class="{'ep-task':true,'ep-docTask':isDoc}">
        <div class="task-total">
            质量控制导航
        </div>
        <div class="task-list">
            <ul v-for="(v,i) of leftList" :key="'leftList'+i" v-if="v.children.some(v=>v.limit)">
                <div class="caption">
                    <div>
                        <img :src="v.imgUrl" alt="" style="width:100%;height:100%;">
                    </div>
                    <h3>{{v.title}}</h3>
                </div>
                <router-link tag="li"  v-for="(value,index) of v.children" :key="'v.children'+index" :to="value.url" v-if="value.limit">
                    <div></div>
                    {{value.page}}
                </router-link>
            </ul>
        </div>

    </div>
    <!-- 医生当月任务统计 -->
    <div class="ep-census" v-if="isDoc">

        <div class="task-info">
            <div class="info-wrap">

                <div class="pre-view">
                    <img :src="docLineOne.img[0]" alt="">
                </div>
                <p class="textEllipsis">
                    <span>{{docLineOne.count.oneCount||0}}</span>
                    本月日常保养任务
                </p>
            </div>
        </div>
        <div class="task-info">
            <div class="info-wrap">

                <div class="pre-view">
                    <img :src="docLineOne.img[1]" alt="">
                </div>
                <p class="textEllipsis">
                    <span>{{docLineOne.count.adverseEventCount||0}}</span>
                    累计上报不良事件总数
                </p>
            </div>
        </div>
        <!-- 工程师top界面
            <div class="task-info">
            <h3>本月待执行任务</h3>
            <div class="task-countWrap">
                <div class="task-count">
                    <div class="task-circle">

                    </div>
                    <div class="task-view">
                        <p>3</p>
                        <div>巡检任务</div>
                    </div>
                </div>
                <div class="task-count">
                    <div class="task-circle">

                    </div>
                    <div class="task-view">
                        <p style="color:#fb9796">14</p>
                        <div>二级巡检任务</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="task-info">
            <h3>本月待执行任务</h3>
            <div class="task-countWrap">
                <div class="task-count">

                </div>
                <div class="task-count"></div>
            </div>
        </div> -->
    </div>
    <!-- 任务日历 -->
    <div class="ep-kalendar">
        <div class="task-type">
            <h3>任务分类</h3>
            <ul>
                <li>
                    <Checkbox v-model="checkAll" @on-change="changeAll">
                        <span class="task-txt">全部任务</span>
                    </Checkbox>
                </li>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <li v-for="(v,i) of tasktype.TypeCheckBox" :key="'TypeCheckBox'+i">
                        <Checkbox :label="v.label">
                            <span class="task-txt">{{v.text}}</span>
                        </Checkbox>
                    </li>
                </CheckboxGroup>
            </ul>
            <ul>
                <li v-for="(v,i) of tasktype.textTips" :key="'textTips'+i" class="txt-tips">
                    <div :style="v.style"></div>
                    <span class="task-txt">{{v.txt}}</span>  
                </li>
            </ul>

        </div>
        <div class="task-kalendar">
            <Kalendar :schedules="calendarData" :useDetailPopup="true" @click-schedule="jump" @date-change="Rerequest"></Kalendar>
        </div>
    </div>

</div>  
</template>

<script>
import Kalendar from '../../../common/kld-calendar/kld-calendar';
import {engineerList,doctorList,docLineOne,calendarDataFormat,chief } from "./API"
export default {
    data(){
        return {
            checkAllGroup:[],
            checkAll:false,
            //判断页面
            isDoc:this.$route.name==="QS-doctor-home",
            
            //doc第一栏
            docLineOne:{
                img:docLineOne,
                count:{}
            },
            // // 工程师质量控制
            // engineerList:engineerList.call(this),
            // //医生质量控制
            // doctorList:doctorList.call(this),
            //通用质控
            engineerList:chief.call(this),


            //工程师任务分类
            engineerType:{
                //任务选择按钮
                TypeCheckBox:[
                    {
                        label:1,
                        text:'巡检任务'
                    },
                    {
                        label:2,
                        text:'保养任务'
                    },
                    {
                        label:3,
                        text:'不良事件'
                    },
                ],
                //工程师日历颜色提示
                textTips:[
                    {
                        style:{
                            width:'14px',
                            height:'14px',
                            backgroundColor:'#9ac4fe'
                        },
                        txt:"巡检任务"
                    },
                    {
                        style:{
                            width:'14px',
                            height:'14px',
                            backgroundColor:'#fb9796'
                        },
                        txt:"保养任务"
                    },
                    {
                        style:{
                            width:'14px',
                            height:'14px',
                            backgroundColor:'#f7a16e'
                        },
                        txt:"不良事件"
                    }
                ]
            },
            //医生任务分类
            doctorType:{

                TypeCheckBox:[
                    {
                        label:4,
                        text:'日常保养'
                    },
                    {
                        label:3,
                        text:'不良事件'
                    },
                ],
                //工程师日历颜色提示
                textTips:[
                    {
                        style:{
                            width:'14px',
                            height:'14px',
                            backgroundColor:'#459ca2'
                        },
                        txt:"日常保养已执行"
                    },
                    {
                        style:{
                            width:'14px',
                            height:'14px',
                            backgroundColor:'#6a84e8'
                        },
                        txt:"日常保养未完成"
                    },
                    {
                        style:{
                            width:'14px',
                            height:'14px',
                            backgroundColor:'#f7a16e'
                        },
                        txt:"不良事件"
                    }
                ]
            },
            //日历数据
            calendarData:[],
            selectedMonth:new Date()
        }
    },
    computed:{
        leftList(){
            return this.engineerList
        },
        tasktype(){
            return this.isDoc?this.doctorType:this.engineerType
        }

    },
    methods:{
        //全选全不选
        checkAllGroupChange(data){
            if(data.length===this.tasktype.TypeCheckBox.length){
                this.checkAll=true;
            }else{
                this.checkAll=false;
            }

            this.getALL(data,this.selectedMonth)
        },
        tipsFormat(arr){
            return arr.map((v,i)=>v.label);
        },
        changeAll(data){
            if(data){
                this.checkAllGroup=this.tipsFormat(this.tasktype.TypeCheckBox);
            }else{
                this.checkAllGroup=[]
            }
            this.getALL(this.checkAllGroup,this.selectedMonth)
        },
        //日程标签点击事件
        jump(data){
            if(data.jump){

                this.$router.push({name:data.page})
            }
        },
        //日历月份变化事件
        Rerequest(date){
            this.selectedMonth=date._date;
            this.getALL(this.checkAllGroup,this.selectedMonth)

        },
        //请求医生页面数据
        getDoctor(){
            this.$axios.get("/statistical/findHomePageByDoctor")
                .then(res=>{
                    this.docLineOne.count=res.data
                }).catch(error=>{

                })
        },
        //请求日历数据
        getALL(type,month){
            month=month.toLocaleString('zh',{year:'numeric',month:'2-digit',day:'2-digit'}).slice(0,7).replace(/\//g,"-");
            if(type.length===0){
                this.calendarData=[];
            }else{

                this.$axios.post("/statistical/findHomePageByEngineeraAndDoctor",{
                    type,
                    month   
                }).then(res=>{
                        this.calendarData=calendarDataFormat.call(this,res.data)
    
                    }).catch(error=>{
    
                    })
            }
        },
       
        showPage(){
            if(this.isDoc){
                this.getDoctor()
            }
        }
    },
    created(){
        this.showPage()
    },
    components:{
        Kalendar
    }
}
</script>

<style lang="less" scoped>
@engineerHeight:685px;
@doctorHeight:800px;
    .employee-wrap{
        width:100%;
        min-width:900px;
        margin:40px auto 0;
        @left:12%;
        @center:1%;

        .ep-task{
            float: left;
            margin-right: @center;
            width: @left;
            height: @engineerHeight;
            background-color: #fafafa;
          
            border-radius: 3px;
            border: solid 1px rgba(2, 31, 57, 0.1);
            box-sizing: border-box;

            .task-total{
                width:100%;
                height: 50px;
                background-color: #459ca2;
                border-radius: 3px 3px 0px 0px;
                padding-left:10px;
                
                font-size: 16px;
                line-height: 50px;
                color: #fafafa;
            }
            .task-list{
                ul{
                    .caption{
                        display: flex;
                        align-items: center;
                        height: 42px;
                        background-color: rgba(208, 208, 208, 0.5);
                        div{
                            width: 18px;
                            height: 18px;
                            margin:0 10px;
                        }
                        h3{
                            
                            font-size: 14px;
                            color: #020e0f;
                        }
                    }
                    li{
                        display: flex;
                        align-items: center;
                        height: 42px;
                        background-color: #fafafa;
                        
                        font-size: 14px;
                        color: #666666;
                        cursor: pointer;
                        div{
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background-color: #459ca2;
                            margin-left:25px;
                            margin-right:5px;
                        }
                    }
                }
            }
        }
        .ep-docTask{
            height: @doctorHeight;
        }

        @right:(100%-@center)-@left;
        .ep-census{
            float: left;
            width: @right;
            height: @doctorHeight - @engineerHeight;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            @preViewWidth:100px;
            .task-info{
                width: 49%;
                height:  @preViewWidth;
                background-color: #fafafa;
            
                border-radius: 3px;
                border: solid 1px rgba(2, 31, 57, 0.1);
                /*padding:15px 20px;*/
                /*医生top界面*/
                .info-wrap{
                    width: 100%;
                    height:100%;
                    display: flex;
                    align-items: center;
                    .pre-view{
                        height:100%;
                        width: @preViewWidth;
                        background-color: #459ca2;
                        border-radius: 3px 0px 0px 3px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-shrink: 0;
                        img{
                            width:60px;
                            height:60px;
                        }
                    }
                    p{
                        display: flex;
                        align-items: center;
                        font-size: 20px;
                        color: #666666;
                        span{
                            display: inline-block;
                            margin:0 24px 0 39px;
                            
                            font-size: 60px;
                            color: #459ca2; 
                        }
                    }

                }




                /*工程师top界面*/
                /*
                h3{
                    height:30px;
                    border-left:4px solid #76bdc1;
                    padding-left:8px;
                    
                    font-size: 16px;
                    line-height: 30px;
                    color: #020e0f;
                    margin-bottom:20px;
                }
                .task-countWrap{
                    display: flex;
                    justify-content: space-between;
                    .task-count{
                        width:48%;
                        height: 65px;
                        background-color: #ffffff;
                        border-radius: 3px;
                        border: solid 1px #c8c7cc;
                        display: flex;
                        align-items: center;
                        .task-circle{
                            width: 40px;
                            height: 40px;
                            background-color: #ffffff;
                            border: solid 1px #d0d0d0;
                            border-radius: 50%;
                            margin:0 10px;
                        }
                        .task-view{
                            height:45px;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            p{
                               
                                font-size: 18px;
                                line-height: 18px;
                                color: #9ac4fe; 
                            }
                            div {
                                
                                font-size: 14px;
                                color: #999999;
                            }
                        }
                    }
                }
                */
                

            }
        }
        //日历样式
        .ep-kalendar{
            float: left;
            width: @right;
            height: @engineerHeight;
            background-color: #fafafa;
            border-radius: 3px;
            border: solid 1px #dce0e6;
            box-sizing: border-box;
            display: flex;
            .task-type{
                width:17%;
                padding-left:25px;
                h3{
                    height:45.5px;
                    border-bottom:1px solid #E5E5E5;
                    line-height: 45.5px;
                    
                    font-size: 16px;
                    color: #666666;
                }
                ul{
                    height:129px;
                    padding-top:15px;
                    &:nth-child(2){
                        border-bottom:1px solid #E5E5E5;
                    }
                    li{
                        margin:3px 0;
                        .task-txt{
                            
                            font-size: 14px;
                            color: #666666;
                            text-indent:5px;
                            display: inline-block;
                        }
                        .txt-tips{
                            width: 14px;
                            height:14px;
                        }
                        &.txt-tips{
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
            .task-kalendar{
                width:83%;
            }
        }
    }

</style>
