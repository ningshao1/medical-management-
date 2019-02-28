<template>
    <kld-collapse :open='open'>
        <span slot="title">
            申请计划详情
        </span>
        <basic-info></basic-info>
        <feasibility-report details></feasibility-report>
    </kld-collapse>
</template>

<script>
import basicInfo from '../basic-info/index';
import feasibilityReport from '../feasibility-report';
import kldCollapse from '../kld-collapse/index';
export default {
    name:'fifty-apply-plan-detail',
    components:{basicInfo,feasibilityReport,kldCollapse},
    props:{
        open:{
            type:Boolean,
            default:false
        }
    }

    
}
</script>

<style>


</style>
