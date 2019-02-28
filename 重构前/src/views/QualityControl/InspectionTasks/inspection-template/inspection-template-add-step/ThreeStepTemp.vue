<template>
    <div style="padding:0 30px;">
        <div class="temp_title">
            巡检要素
        </div>
        <div class="category">
            <div class="categoryLeft">
                <div class='title'>检查类别 <span @click='addElement'>+ 添加类别</span></div>
                <div class='categoryScroll'>
                    <ul>
                        <li v-for="(item,i) in CheckCategoryList" :key='i'  @click='trigger(item,i)' :class='triggerIndex==i?"click_li":"click_lis"'>
                            <span class="textEllipsis" :title="item.name">{{item.name}}</span>
                            <span @click.stop='del(item,i)'>删除</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="categoryRight">
                <div class="r_left r_wrap">
                    <div class='r_title'>
                        巡检项
                    </div>
                    <ul class='r_content'>
                        <li :class='{textEllipsis:true,clicked:clickedIndex==i}' @click="examine(item,i)" :title='item.lName' v-for="(item,i) in content" :key='i'>
                            <span>{{i+1}}、</span>{{item.lName}}</li>
                    </ul>
                </div>
                <div class="r_right r_wrap">
                    <div class='r_title'>
                        巡检要素
                        <span>
                            * 所有检查项的评判结果分为二等：<span>合格、不合格</span>
                        </span>
                    </div>
                    <ul>
                        <!-- <template v-if="elements.length"> -->
                            <li style="display: flex;" :title='item.content' v-for="(item,i) in elements" :key='i'>
                                <span>{{i+1}}、</span>
                                <span>{{item.eContent}}</span>
                            </li>
                        <!-- </template> -->
                        <!-- <li :class='{textEllipsis:true}' v-else>
                            暂无巡检要素
                        </li> -->
                    </ul>
                    

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import kldConfirm from "@common/kld-confirm";
export default {
    props: {
        //类别列表
        CheckCategoryList: {
            default() {
                return [];
            },
            type: Array
        }
    },
    created() {},
    data() {
        return {
            triggerIndex: -1,
            //检查项
            content: [],
            elements:[],
            modal1: false,
            clickedIndex:0,
        };
    },
    watch: {
        CheckCategoryList:{
            handler(newData){
                this.trigger(newData[0], 0);
            },
            immediate:true
        },
        content:{
            handler(newData){

            this.clickedIndex=0;
            this.elements=newData.length==0?[]:(newData[0].pmElements||[]);
            },
            immediate:true

        }
    },
    methods: {
         //点击巡检项
        examine(item,i){
            this.elements=item.pmElements,
            this.clickedIndex=i;
        },
        //切换检查类别
        trigger(item, i) {
            this.triggerIndex = i;
             this.content=item?item.pmElementTypes:[];
            
        },
        //触发添加类别的按钮
        addElement() {
            this.$emit("showModal", true);
        },
        //触发删除按钮
        del(item, i) {
            const that = this;

            kldConfirm({
                title: "提示",
                content: "确定删除此类别？",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok() {
                    that.CheckCategoryList.splice(i, 1);
                    if (that.CheckCategoryList.length == 0) {
                        that.content = [];
                    }
                    that.$emit("delC",{ index: i, value: item });
                }
            });

            this.$emit("delCategory", { index: i, value: item });
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
.Pcategory {
    width: 800px;
}
.category {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    height: 450px;
    //左边部分
    .categoryLeft {
        width: 20%;
        margin-right: 15px;
        box-sizing: border-box;

        overflow: hidden;
        border-radius: 3px;
        border: solid 1px #c8ced3;
        .categoryScroll {
            overflow-y: auto;
            height: 350px;
            > ul {
                // border: solid 1px #c8ced3;
                li {
                    display: flex;
                    flex-direction: row;
                    padding: 0 15px;
                    justify-content: space-between;
                    align-items: center;
                    height: 55px;
                    border-bottom: solid 1px #c8ced3;
                    background-color: #fafafa;
                    cursor: pointer;
                    > span {
                        color: #666666;
                        font-size: 14px;
                    }
                    > span:nth-of-type(1) {
                        max-width: 120px;
                    }
                    > span:nth-of-type(2) {
                        color: #a9a8a9;
                        cursor: pointer;
                    }
                }
                //点击检查类别的样式
                .click_li {
                    border-left: solid 2px #01b0c7;
                    background-color: #f5f6fa !important;
                    > span:nth-of-type(1) {
                        color: #01b0c7;
                    }
                }
            }
        }

        > .title {
            font-size: 14px;
            color: #666666;
            font-weight: 600;
            padding: 15px 15px;
            border-bottom: solid 1px #c8ced3;
            background-color: #eaeaea;
            display: flex;
            justify-content: space-between;
            >span{
                cursor: pointer;
                
                font-size: 14px;
                color: rgb(12, 131, 250);
            }
        }
        > a {
            display: block;
            cursor: default;
            text-align: center;
            line-height: 40px;
            p {
                cursor: pointer;
                display: inline-block;
                > span {
                    color: #78bbc0;
                    font-size: 14px;
                    cursor: pointer;
                }
                span:nth-of-type(1) {
                    font-size: 20px;
                }
            }
        }
    }
    .categoryRight {
        width: 80%;
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-flow: row nowrap;
        .r_wrap{
            height: 100%;
            .r_title {
                width: 100%;
                border-radius: 3px 3px 0px 0px;
                border: solid 1px #c8ced3;
                color: #666666;
                font-size: 14px;
                padding: 15px;
                font-weight: 600;
                background-color: #eaeaea;
            }
        }
        .r_left{
            width:30%;
            .r_content {
                overflow: auto;
                height: 88.3%;
                background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px #c8ced3;
                border-top: none;
                > li {
                     width: 100%;
                    padding: 15px 5px;
                    background-color: #f5f6fa;
                    border-bottom: solid 1px #c8ced3;

                    
                    font-size: 14px;
                    color: #666666;
                    cursor: pointer;
                }
                .clicked{
                    background-color: red;
                    color: #0c8399;
                    background-color: #fafafa;
                    border-left:4px solid #0c8399;
                }
            }
        }
        .r_right{
            width:70%;
            margin-left: -1px;
            .r_title{
                display: flex;
                justify-content: space-between;
                >span{

                    
                    font-size: 14px;
                    color: rgb(12, 131, 250);
                    font-weight: normal;
                    >span{
                        font-weight: bold;
                    }
                }
            }
            >ul{
                overflow: auto;
                height: 88.3%;
                padding: 0 15px;
                // background-color: #ffffff;
                border-radius: 3px;
                border: solid 1px #c8ced3;
                border-top: none;
                > li {
                    padding: 15px 0px;
                    border-bottom: 1px solid #e2e2e2;
                    
                    font-size: 14px;
                    color: #666666;

                    
                }

            }
        }
    }
}
</style>