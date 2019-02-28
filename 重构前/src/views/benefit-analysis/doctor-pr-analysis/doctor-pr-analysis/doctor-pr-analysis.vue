<template>

    <div class="doctor-pr-analysis-wrap">
        <div class="searh-wrap">
            <i-row :gutter='10'>
                <i-col :span="5">
                    <i-input class="kld-input" :placeholder="'诊断医生'" clearable v-model="searchData.doctorName"></i-input>
                </i-col>
                <i-col :span="4">
                   
                    <date-picker class="kld-date-picker" type="daterange" v-model="searchData.daterange"></date-picker>
                </i-col>
                <i-col :span="4">
                    <kld-input-number :placeholder="'请输入阳性率'" :max='100' :min='0' :number='true' class='pr-input' ref="positive-rate" v-model="searchData.positiveRate">
                        <span slot='prepend'>阳性率</span>
                        <span slot="append">%</span>
                        <Select v-model="searchData.positiveRateType " class="kld-select append-select" slot="append" style="width: 60px">
                            <Option :value="1" :disabled='searchData.positiveRate===100'>以上</Option>
                            <Option :value="2" :disabled='searchData.positiveRate===0'>以下</Option>
                        </Select>
                    </kld-input-number>
                </i-col>
            </i-row>

        </div>
        <div class="doctor-pr-analysis-list">

            <i-table :loading='!!listLoading' :columns='columns' :data='listData'></i-table>
            <kld-page :pageSize='page.size' :current="page.current" :total="page.total" @on-change="pageChange" style="margin:15px 0;"></kld-page>
        </div>
        <!-- <Button @click="$router.push({name:'diagnostic-history'})">查看历史</Button> -->
    </div>
</template>
<script>
import kldInputNumber from "@common/kld-input-number";
import kldPage from "@common/page";
import moment from "moment"

export default {
    name: "doctor-pr-analysis",
    components: { kldInputNumber, kldPage },
    data() {
        const current=new Date();
        return {
            searchData: {
                doctorName: "",
                positiveRate: 0,
                positiveRateType: 1,
                daterange:[new Date(current.getFullYear(),current.getMonth()-1,1),new Date(current.getFullYear(),current.getMonth(),0)]
            },
            columns: [
                {
                    title:'诊断医生',
                    key:"doctorName"
                },
                {
                    title:'当期开单数',
                    key:"allNumber",
                    sortable:true,
                    sortMethod:(a,b,type)=>{
                            return type==='desc'? (+b)-(+a):(+a)-(+b)
                    }
                },
                {
                    title:'当期未判定单数',
                    key:"unknowCount",
                    sortable:true,
                    sortMethod:(a,b,type)=>{
                            return type==='desc'? (+b)-(+a):(+a)-(+b)
                    }
                },
                {
                    title:'当期阳性率',
                    key:"positiveRate",
                    render:(h,{column,row,index})=>{
                        return h('span',`${Math.round((row[column.key]||0)*100)}%`)
                    },
                    sortable:true
                },
                {
                    title:'操作',
                    key:'config',
                    render:(h,{column,row,index})=>{
                        return h('span',{
                            on:{
                                click:()=>{
                                    this.viewHistory(row)
                                }
                            },
                            style:{
                                color:'#2d8cf0'
                            }
                        },'诊断历史')
                    }
                },
            ],
            listData: [
            ],
            listLoading:0,
            page:{
                size:10,
                current:1,
                total:0
            },
            searchTimer:null,
            cancelToken:null,//清除重复请求,
            dateFormat:"YYYY-MM-DD"
        };
    },
    computed:{
        searchDate(){
            return this.searchData.daterange.map(date=>moment(date).format(this.dateFormat));
        }
    },
    watch: {
        searchData:{
            handler(){
                clearTimeout(this.searchTimer);
                this.searchTimer=setTimeout(()=>{
                    this.getList();
                },200)
            },
            deep:true
        },
        "searchData.positiveRate": {
            handler(value) {
                if (value === 0) {
                    this.searchData.positiveRateType = 1;
                }
                if (value === 100) {
                    this.searchData.positiveRateType = 2;
                }
            }
        }
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            this.pageChange();
        },
        pageChange(page=1){
            if(this.cancelToken){
                this.cancelToken();
            }
            this.page.current=page;
            this.listLoading++;
            const request={//请求参数
                limit:this.page.size,
                offset:(this.page.current-1)*this.page.size,
                params:{
                    doctorName:this.searchData.doctorName.trim(),
                    startDate:this.searchDate[0],
                    endDate:this.searchDate[1],
                    positiveRate:this.searchData.positiveRate/100,
                    positiveRateType:this.searchData.positiveRateType,
                    hospId:this.$store.state.user_in.osId
                    // hospId:"514872920313434233"
                    
                }
            }
            const config={
                cancelToken:new this.$axios.CancelToken((c)=> {
                    // executor 函数接收一个 cancel 函数作为参数
                    this.cancelToken = c;
                })
            }
            this.$axios.post(`/cba/getNewPositiveByDoctorNameList`,request,config)
            .then(({data:{data,recordsTotal}})=>{
                this.listData=data||[];
                this.page.total=recordsTotal||0
            })
            .finally(()=>{
                this.listLoading--;
            })
        },
        viewHistory(doctorInfo){//查看诊断历史    
            this.$router.push({name:'diagnostic-history',query:{id:doctorInfo.doctorId}})
        }
    }
};
</script>
<style lang="less" scoped>
.doctor-pr-analysis-wrap {
    .searh-wrap {
        background: rgb(250, 250, 250);
        width: 100%;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        padding: 20px;
        margin-top: 20px;
        /deep/.pr-input {
            .append-select {
                .ivu-select-selection:hover {
                    border-color: transparent;
                }
            }
            .ivu-input {
                text-align: right;
            }
        }
    }
    .doctor-pr-analysis-list{
        background: rgb(250, 250, 250);
        width: 100%;
        border-radius: 3px;
        border: solid 1px rgba(2, 31, 57, 0.1);
        margin-top: 20px;
        /deep/.ivu-table{
            .ivu-table-header{

                th{
                    font-size: 14px;
                }
            }
            .ivu-table-row{
                td{
                    font-size: 14px;
                    background-color: transparent;
                }
            }
            .ivu-table-sort{
                font-size: 17px;
                    width: 12px;
                    height: 14px;
            }
        }
    }
}
</style>


