<template>
    <div style="padding:0 30px;">

        <div class="temp_title">
            保养要素
        </div>
        <div class="category">
            <category :CategoryData='CheckCategoryList' @GetCategory='GetCategory' @AddCategory='addElement' @DelCategory='DelCategory' :delBtn='$route.name==="TwoTemplateDetails"?false:true'></category>
            <div class="categoryLeft" style=" margin-right:0;border-right:none">
                <div class='title'>保养项</div>
                <div class='categoryScroll' style="height:400px">
                    <ul>
                        <li v-for="(item,i) in maintainItem" :key='i' @click='trigger(item,i)' :class='triggerIndex==i?"click_li":"click_lis"'>
                            <span class="textEllipsis">{{item.lName}}</span>
                            <!-- <span @click.stop='del(item,i)' v-if='showDel'>删除</span> -->
                        </li>
                    </ul>
                </div>
                <!-- <a>
                    <p @click='addElement'>
                        <span>+</span>
                        <span>添加类别</span>
                    </p>
                </a> -->
            </div>
            <div class="categoryRight">
                <div class='r_title'>
                    保养要素
                    <div class='r_title-tip'>
                        * 所有检查项的评判结果分为二等：合格、不合格
                    </div>
                </div>
                <ul class='r_content'>
                    <li class='textEllipsis' :title='item.eContent' v-for="(item,i) in content" :key='i'>
                        <span>{{i+1}}、</span>{{item.eContent}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import kldConfirm from "@common/kld-confirm";
import category from "@common/Addcategory/index";
export default {
    props: {
        showDel: {
            default: true,
            type: Boolean
        },

        //类别列表
        CheckCategoryList: {
            default() {
                return [];
            },
            type: Array
        }
    },
    watch: {
        CheckCategoryList: {
            handler(){
                if(this.CheckCategoryList.length){
                    this.maintainItem = this.CheckCategoryList[0].pmElementTypes;
                    this.content = this.maintainItem[0].pmElements;
                }
            },
            immediate:true
        }
    },
    data() {
        return {
            triggerIndex: 0,

            content: [], //保养要素
            modal1: false,
            maintainItem: [] //保养项列表
        };
    },
    methods: {
        //切换检查类别
        trigger(item, i) {
            this.triggerIndex = i;
            this.content = item.pmElements;
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
                content: "是否删除",
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                okText: "确定", //确认按钮文本  默认:确认
                cancelText: "取消", //确认取消文本  默认:取消
                ok() {
                    that.CheckCategoryList.splice(i, 1);
                    if (that.CheckCategoryList.length == 0) {
                        that.content = [];
                    }
                    that.$emit("delC");
                },
                cancel() {
                    //取消按钮同上
                    console.log("cancel");
                }
            });

            this.$emit("delCategory", { index: i, value: item });
        },

        /*
    保养要素事件
    */
        GetCategory(value) {
            this.maintainItem = value.pmElementTypes;
            this.content = this.maintainItem[0].pmElements;
        },
        DelCategory(item, i) {
            console.log(i)
            this.CheckCategoryList.splice(i, 1);
            if (this.CheckCategoryList.length == 0) {
                this.maintainItem = [];
                this.content = [];
            }
            this.$emit("delC");
            this.$emit("delCategory", { index: i, value: item });
        }
    },
    components: {
        category
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
    /deep/.categoryLeft {
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
            // padding: 15px 15px;
            padding: 12px 8px;
            border-bottom: solid 1px #c8ced3;
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
        width: 60%;
        box-sizing: border-box;
        height: 100%;
        overflow: auto;
        .r_title {
            border-radius: 3px 3px 0px 0px;
            border: solid 1px #c8ced3;
            color: #666666;
            font-size: 14px;
            padding: 12px 8px;
            // padding: 15px;
            font-weight: 600;
            display: flex;

            justify-content: space-between;

            .r_title-tip{
                color:rgb(12, 131, 250);
            }
        }
        .r_content {
            height: 89.6%;
            padding: 0 15px;
            background-color: #ffffff;
            border-radius: 3px;
            border: solid 1px #c8ced3;
            border-top: none;
            > li {
                padding: 15px 0px;
                border-bottom: 1px solid #e2e2e2;
                font-size: 12px;
                color: #666666;
            }
        }
    }
}
</style>