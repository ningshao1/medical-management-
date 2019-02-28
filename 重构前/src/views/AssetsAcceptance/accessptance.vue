<template>
    <div class="QS-wrap">
        <div class="QS-breadcrumb container">
            <router-link tag="div" to="/index/home">首页</router-link>
            <router-link tag="div" v-for="(v,i) of breadcrumb" :key="'breadcrumb'+i" v-if="i>0&&i<breadcrumb.length-1" :to="{path:v.path,query:v.meta.query}"><span class="breadcrumb-gt">></span>{{v.meta.label}}</router-link>
            <div v-else-if="i===breadcrumb.length-1"><span class="breadcrumb-gt">></span>{{v.meta.label}}</div>
        </div>
        <div class="QS-pageTips container" >
            <img :src="breadcrumb[breadcrumb.length-1].meta.imgUrl" alt="" v-if="breadcrumb[breadcrumb.length-1].meta.imgUrl">
            {{breadcrumb[breadcrumb.length-1].meta.label}}
            <div></div>
        </div>
        <div class="QS-content container">
            <router-view></router-view>
        </div>
        <div class='QS-footer'>
            Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
        </div>
    </div>
</template>
<script>
export default {
    computed:{
        breadcrumb(){
            return this.$route.matched.filter((v,i)=>{
                return ! v.meta.breadcrumbHide && v.meta.label;
            })
        },
    },
};
</script>

<style lang="less" scoped>
.QS-wrap{
    display: flex;
    flex-direction: column;
    width:100%;
    min-height: ~'calc(100vh - 73px)';
    .QS-breadcrumb{
        display:flex;
        height:34px;
        padding-top:14px;
        div{
            line-height: 20px;
            font-size:12px;
            cursor: pointer;
            color: #999;
            &:first-child{
                border-left:5px solid #76bdc1;
                padding-left:10px;
            }
            .breadcrumb-gt{
                color:#76bdc1
            }
            &:last-child{
                color:#000;
            }
        }
    }
    .QS-pageTips{
        padding-top:10px;
        font-size: 18px;
	    color: #020e0f;
        div{
            margin:10px 0 15px;
            width:100%;
            height:1px;
            background-color:#ccd2d7;
        }
        img{
            width:20px;
            height:20px;
            display: inline-block;
            margin-bottom: -3px;
        }
    }
    .QS-content{
        flex-grow: 1;
    }
    .QS-footer{
        width: 100%;
        height:45px;
        margin-top:30px;
        text-align: center;
        font-size: 14px;
        line-height: 45px;
        color: #333;
        background-color: rgba(2,31,57,.15);
    }
}
</style>
