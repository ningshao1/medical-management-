<template>
    <header class="kld-learn-more-head">
        <div class="head-content">
            <slot name="title">
                <div class="kld-learn-more-title">
                    {{title}}
                </div>
            </slot>
            <slot name="jump">
                <div class="learn-more" @click="query" v-if="view">
                    {{jumpName}}
                    <img :src="learnMoreImg" alt="">
                </div>
            </slot>
        </div>
    </header>
</template>


<script>
export default {
    name:'kld-title',
    props:{
        title:{//标题
            type:[String,Number],
            default:''
        },
        learnMoreImg:{//图标
           default:require('./images/查看更多.png')
        },
        view:{//是否显示 可用于权限
            type:Boolean,
            // required:true,
            default:true
        },
        jumpName:{//
            type:String,
            default:'查看更多'
        },
        target:{
            type:[Object,String],
            default:null
        }
    },
    methods:{
        query(){
            if(this.target){
                if(typeof this.target==="string"){
                    this.$router.push({name:this.target});
                }
                if(typeof this.target==='object'){
                    this.$router.push(this.target);
                }
                return
            }
            this.$emit('learn-more');
        }
    }
    
}
</script>

<style lang="less" scoped>
 .kld-learn-more-head{
        height:30px;
        width: 100%;
        .head-content{
            height: 100%;
            width: 100%;
            
            display: flex;
            justify-content: space-between;
            align-items: center;
            .kld-learn-more-title{
                color:#020e0f;
                font-size: 16px;
                height: 100%;
                border-left:4px solid #76bdc1;
                text-indent: 10px;
                line-height: 30px;
            }
            .learn-more{
                width:80px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #459ca2;
                font-size: 14px;
                cursor: pointer;
                &:active{
                    opacity: 0.8;
                    
                }
            }
        }
    }

</style>
