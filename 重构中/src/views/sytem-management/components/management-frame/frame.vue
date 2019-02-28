<template>
    <div class="common-frame"
         style="height:70vh;overflow:hidden">
        <div class="left">
            <div class="title">
                {{leftTitleName}}
            </div>
            <slot name="left">
                <div class="input-title">
                    <el-input placeholder="请输入检索词"
                              v-model="inputVal"
                              size='large'></el-input>
                </div>
                <el-scrollbar :native='false'
                              class="list-bar">
                    <ul>
                        <li v-for="item in data"
                            :key="item[props.key]"
                            :class="{active:item[props.key]===listId}"
                            @click="listId=item[props.key]">{{item[props.name]}}</li>
                    </ul>
                </el-scrollbar>
            </slot>
        </div>

        <div class="right">
            <p class="title">{{rightTitleName}}</p>
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
import pinyin from "@/utils/pinyin-match";
import scroll from "@/element-ui/scrollBar";
export default {
    name: "managementFrame",
    props: {
        listData: {
            type: Array,
            default: []
        },
        value: {
            type: [String, Number]
        },
        leftTitleName: {
            type: String,
            default: "标签分类"
        },
        rightTitleName: {
            type: String,
            default: "资产标签"
        },
        props: {
            type: Object,
            default() {
                return {
                    key: "key",
                    name: "name"
                };
            }
        },
        search: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputVal: "",
            data: []
        };
    },
    computed: {
        listId: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        }
    },
    watch: {
        listData: {
            handler(val) {
                this.data = JSON.parse(JSON.stringify(val));
            },
            immediate: true
        },
        inputVal(val) {
            const filterData = [];
            this.listData.map(v => {
                if (pinyin(v[this.props.name], val)) {
                    filterData.push(v);
                }
            });
            this.data = filterData;
        }
    },
    components: {
        [scroll.name]: scroll
    },
    mounted() {
        // this.$nextTick(() => {
        //     const clientWidth = document.body.clientWidth;
        //         clientWidth
        // });
    }
};
</script>
<style scoped lang="scss">
@import "@/styles/var.scss";
@import "../common";
$padding: 20px;
.title {
    padding-left: 20px;
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.65);
}
.input-title {
    padding: 8px;
}
.common-frame {
    background: #fff;
    min-height: 500px;
    display: flex;
    .left {
        width: 240px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .right {
        flex: 1;
        min-width: 0;
        > p {
            margin: 0 20px;
            border-bottom: 1px dotted;
            padding-left: 0;
            font-size: 16px;
        }
    }
    /deep/.list-bar {
        height: calc(70vh - 100px);
        padding-bottom: 20px;
        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
}
</style>
