<template>
    <ul class="opion-voting-statistics">
        <li class="parts">
            <span class="option-parts">同意</span>
            <span class="count count1">{{agree}}</span>
        </li>
        <li class="parts">
            <span class="option-parts">拒绝</span>
            <span class="count count2">{{disagree}}</span>
        </li>
        <li class="parts">
            <span class="option-parts">未表决</span>
            <span class="count count3">{{discard}}</span>
        </li>
    </ul>
</template>
<script>
export default {
    name:'opion-voting-statistics',
    data(){
        return {
            agree:0,
            disagree:0,
            discard:0,
        }
    },
    // props:{
    //     agree:{
    //         type:[String,Number],
    //         default:0
    //     },
    //     disagree:{
    //         type:[String,Number],
    //         default:0
    //     },
    //     discard:{
    //         type:[String,Number],
    //         default:0
    //     },
    // },
    created(){
        this.$axios.get(`/annualPlanTmp/getApproveResult/${this.$route.query.id}`)
            .then(res=>{
                this.discard=res.data.find(v=>v.voteType===0)?res.data.find(v=>v.voteType===0).count:0
                this.agree=res.data.find(v=>v.voteType===1)?res.data.find(v=>v.voteType===1).count:0
                this.disagree=res.data.find(v=>v.voteType===2)?res.data.find(v=>v.voteType===2).count:0
            })
    }
    
}
</script>
<style lang="less" scoped>
.opion-voting-statistics{
    display: flex;
    .parts{
        height: 22px;
        min-width: 100px;
        padding:0 20px;
        border-left: 1px solid #d0d0d0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        &:first-child{
            border-left: none;
        }
        .option-parts{
            font-size: 14px;
            color: #666666;
        }
        .count{
                font-size: 18px;
            &1{
                color: #0c8399;

            }
            &2{
                    color: #e7485a;
            }
            &3{
                    color:#aaa;
            }
        }
    }
}
</style>


