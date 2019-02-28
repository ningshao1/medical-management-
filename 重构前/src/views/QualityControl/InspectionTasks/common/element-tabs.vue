<template>
    <div class="element-tabs">
        <div class="tabs">
            <div class="tabs-title tabs-item">{{typeTitle}}</div>
            <div v-if="listLimit" class="tab-wrap">
                <div class="custom-tabs">
                    <div class="tabs-title tabs-item tabs-title-child">
                        <Icon class="active-color" type="chevron-right"></Icon>
                        <span>基础项</span>
                        <a v-if="addLimit&&typeListLoaded" @click="addType(false)" href="javascript:" class="active-color">+ 新增类别</a>
                    </div>
                    <ul>
                        <li v-for="(type, index) in internalTypeList" @click="internalTypeClick(type)" :key="index" :class="{active: currentType === type}" :title="type.title" class="textEllipsis tabs-item">
                            <span class="textEllipsis custom-classes-title">{{type.title}}</span>
                            <a v-if="delLimit && currentType === type" @click.stop="delType(type)" href="javascript:" class="del" >删除</a>
                        </li>
                    </ul>
                </div>
                <div class="custom-tabs">
                    <div class="tabs-title tabs-item tabs-title-child">
                        <Icon class="active-color" type="chevron-right"></Icon>
                        <span>自定义项</span>
                        <a v-if="addLimit" @click="addType(true)" href="javascript:" class="active-color">+ 新增类别</a>
                    </div>
                    <ul>
                        <li v-for="(type, index) in customTypeList" :title="type.title" @click="customTypeClick(type)" :key="index" :class="{active: currentType === type}" class="tabs-item">
                            <span class="textEllipsis custom-classes-title">{{type.title}}</span>
                            <a v-if="delLimit && currentType === type" @click.stop="delType(type)" href="javascript:" class="del" >删除</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="tab-panes">
            <div class="inspect-item">
                <div class="custom-tabs">
                    <div class="tabs-title tabs-item">
                        <span>{{itemTitle}}</span>
                        <!-- <a v-if="addLimit && isCustomType && currentType !== null" @click="addItem" class="active-color" href="javascript:">+ 新增项</a> -->
                        <a v-if="addLimit && currentType !== null" @click="addItem" class="active-color" href="javascript:">+ 新增项</a>
                    </div>
                    <ul v-if="listLimit" class="tab-wrap">
                        <li v-for="(item, index) in itemList" :title="item.title" @click="itemClick(item)" :key="index" :class="{active: currentItem === item}" class="tabs-item">
                            <span class="textEllipsis custom-classes-title">{{item.title}}</span>
                            <!-- <a v-if="delLimit && isCustomType && currentItem === item" @click.stop="delItem(item)" href="javascript:" class="del">删除</a> -->
                            <a v-if="delLimit && currentItem === item" @click.stop="delItem(item)" href="javascript:" class="del">删除</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="inspect-element">
                <div class="tabs-title tabs-item">
                    <span>{{elementTitle}}</span>
                    <span style="color:#0c83fa">
                        *所有检查项的评判结果分为：
                        <span style="font-weight:600">合格、不合格</span>
                    </span>
                </div>
                <div v-if="listLimit" class="tab-panes-content">
                    <!-- <ul v-if="! isCustomType">
                        <li v-for="(element, index) in elementList" :key="index" class="tab-panes-list">
                            <span>{{index + 1}}、</span>
                            <span>{{element.title}}</span>
                        </li>
                    </ul> -->
                    <ul  class="custom-tab-panes-content">
                        <li v-for="(element, index) in elementList" :key="index">
                            <span class="index">{{index + 1}}、</span>
                            <div @click="editLimit && elementClick(element)" class="kld-input ivu-input">{{element.title}}</div>
                            <Button v-if="delLimit" @click="delElement(element)" class="custom-tab-panes-content-del" type="ghost" shape="circle" icon="android-close"></Button>
                        </li>
                    </ul>
                    <!-- <div v-if="addLimit && isCustomType && currentItem !== null" class="add-rule"> -->
                    <div v-if="addLimit  && currentItem !== null" class="add-rule">
                        <add-btn @click="addElement">新增检查细则</add-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .active-color {
        color: #0c8399;
    }
    .element-tabs {
        height: 100%;
        line-height: 1.2;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        .tabs-item {
            border-bottom: solid 1px rgba(2, 31, 57, 0.1);
            border-top: none;
            padding: 16px 20px;
            color: #666666;
            background-color: #f5f6fa;
            &.active {
                background-color: #fafafa;
                padding-left: 20 - 4px;
                border-left: 4px solid #0c8399;
            }
        }

        li.tabs-item {
            cursor: pointer;
        }

        .tabs-title {
            background-color: #eaeaea;
            border: 0;
            border-bottom: 1px solid rgba(2, 31, 57, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            &.tabs-title-child{
                padding: 12px 20px;
                background-color: #dedede;
                position: relative;
                .ivu-icon{
                    position: absolute;
                    left: 4px;
                    top: (38 - 14) / 2 px;
                }
            }
        }
        .custom-tabs {
            li.tabs-item {
                display: flex;
                justify-content: space-between;
                .del {
                    color: inherit;
                    &:hover {
                        color: #ed3f14;
                    }
                }
            }
        }
        .tabs,
        .tab-panes {
            border-radius: 3px;
            overflow: hidden;
            background-color: #fafafa;
            border: solid 1px rgba(2, 31, 57, 0.1);
        }
        .tabs {
            width: 301px;
            margin-right: 20px;
            flex-shrink: 0;
            .add-classes {
                text-align: center;
                padding: 10px;
            }
        }
        .tab-wrap{
            height: calc(~'100% - 46px');
            overflow: auto;
        }
        .custom-classes-title {
            width: calc(~"100% - 50px");
        }
        .tab-panes {
            display: flex;
            flex-direction: row;
            flex-grow: 1;

            .inspect-item{
                flex-shrink: 0;
                width: 301px;
                border-right: 1px solid #e0e0e0;
                .custom-tabs{
                    height: 100%;
                }
            }
            .inspect-element{
                flex-grow: 1;
            }

            .tab-panes-content {
                max-height: calc(~"100% - 47px");
                overflow: auto;
                padding: 0 20px;
                .tab-panes-list {
                    display: flex;
                    padding: 15px 0;
                    border-bottom: 1px solid #e2e2e2;
                }
            }
            .custom-tab-panes-content {
                li {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    /*margin-bottom: 10px;*/
                    margin-top: 10px;
                    &:first-of-type {
                        margin-top: 20px;
                        /*margin-bottom: 0;*/
                    }
                }
                .index {
                    margin-right: 20px;
                    width: 10px;
                    line-height: 1;
                    height: 14px;
                }
                .custom-tab-panes-content-del {
                    margin-left: 20px;
                    flex-shrink: 0;
                }

                .kld-input{
                    min-height: 38px;
                    line-height: 20px;
                    padding-top: 8px;
                    padding-bottom: 8px;
                    height: auto;
                    font-size: 14px;
                }
            }
            .add-rule {
                padding: 0 48px 0 30px;
                .add-btn{
                    margin-top: 18px;
                }
                /*.add-rule-btn {*/
                    /*box-shadow: none;*/
                    /*width: 100%;*/
                    /*margin-top: 18px;*/
                    /*color: #0c8399;*/
                    /*border-color: #dcdcdc;*/
                    /*&:active {*/
                        /*border-color: #0c8399;*/
                    /*}*/
                /*}*/
            }
        }
    }
</style>

<script>
    import addBtn from '@inspection-common/add-btn';

    export default {
        name: "element-tabs",
        components: {addBtn},
        props: {
            addLimit: {
                type: Boolean,
                default: true
            },
            editLimit: {
                type: Boolean,
                default: true
            },
            delLimit: {
                type: Boolean,
                default: true
            },
            listLimit: {
                type: Boolean,
                default: true
            },
            typeTitle: {
                type: String,
                default: '检查类别'
            },
            itemTitle: {
                type: String,
                default: '检查项'
            },
            elementTitle: {
                type: String,
                default: '检查要素'
            },
            typeListLoaded:{//分类的初始数据是否loaded
                type:Boolean,
                default:false
            },
            internalTypeList: {
                type: Array,
                default() {
                    return [];
                }
            },
            customTypeList: {
                type: Array,
                default() {
                    return [];
                }
            },
            itemList: {
                type: Array,
                default() {
                    return [];
                }
            },
            elementList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                currentType: null,
                currentItem: null,
                isCustomType: false
            };
        },

        watch: {
            internalTypeList() {
                this.currentType = null;
            },
            itemList() {
                this.currentItem = null;
            }
        },

        methods: {
            internalTypeClick(type) {
                this.isCustomType = false;
                this.currentType = type;
                this.$emit('click-type', type,this.isCustomType);
            },

            customTypeClick(type) {
                this.isCustomType = true;
                this.currentType = type;
                this.$emit('click-type', type,this.isCustomType);
            },

            itemClick(item) {
                this.currentItem = item;
                this.$emit('click-item', item);
            },

            elementClick(element) {
                this.$emit('click-element', element);
            },



            delType(type) {
                this.$emit('del-type', type);
            },

            delItem(item) {
                this.$emit('del-item', item);
            },

            delElement(element) {
                this.$emit('del-element', element);
            },

            addType(isCustomType) {
                this.$emit('add-type',isCustomType);
            },

            addItem() {
                this.$emit('add-item');
            },

            addElement() {
                this.$emit('add-element');
            }
        }
    };
</script>