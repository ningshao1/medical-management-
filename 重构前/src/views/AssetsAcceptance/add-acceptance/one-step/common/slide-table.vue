<template>
    <div class="slide-table-input">
        <i-input class="kld-input"
                 @on-change='searchChange($event)'
                 @on-focus="searchFocus"
                 v-model="inputValue"
                 ref="search-input"
                 clearable
                 @on-keydown='handleKeydown'
                 :placeholder="placeholder"
                 v-bind="$attrs"></i-input>
        <transition name="slide-up">
            <div class="asset-name-select-wrap"
                 v-show="slideShow"
                 ref='asset-name-select'>
                <template v-if="!timeOut">
                    <table class="asset-name-select-table"
                           ref='asset-ul'>
                        <thead v-if='showHead'>
                            <tr class="asset-thead">
                                <th class="asset-th"
                                    v-for="(v,i) of columns"
                                    :key="v.key+i"
                                    :style="{width:v.width}">
                                    {{v.title}}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(v,i) of data"
                                :ref='`asset-li-${i}`'
                                class="ivu-select-item"
                                :class="{'focus-li':i===focusIndex,'click-li':i===clickIndex}"
                                :key="v.id"
                                @click="getTrInfo(v,i)">
                                <!-- {{v.assetName}} -->
                                <td class="asset-td"
                                    v-for="(item,index) of columns"
                                    :title='v[item.key]'
                                    :key="item.key+index"
                                    style='text-align:center;padding:10px;'>
                                    <div class='textEllipsis'
                                         ref="row-td">
                                        {{v[item.key]}}
                                    </div>
                                    <!-- {{v[item.key]}} -->
                                </td>
                            </tr>
                        </tbody>
                        <!-- <li v-for="(v,i) of data" :ref='`asset-li-${i}`' class="ivu-select-item" :class="{'focus-li':i===focusIndex,'click-li':i===clickIndex}" :key="v.id" @click="getPreInfo(v,i)">{{v.assetName}}</li> -->
                    </table>
                    <kld-page style="margin-top:3px;"
                              :total='page.total'
                              :current='page.current'
                              :page-size="page.size"
                              @on-change='pageChange'></kld-page>
                    <kld-loading v-if='loading'></kld-loading>
                </template>
                <template v-else>
                    <div class='asset-name-time-out-wrap'>
                        <div class="asset-name-time-out">

                            <Icon type="paper-airplane"
                                  class="time-out-icon"></Icon>
                            <span style="font-size:14px;">请求超时，请</span>
                            <a href='javascript:void(0);'
                               style="font-size:14px;"
                               @click="pageChange(1)"
                               class="asset-name-refresh">重试</a>
                        </div>
                    </div>
                </template>
            </div>
        </transition>
    </div>
</template>
<script>
import kldPage from "@common/page/page.vue";
import kldLoading from "@common/loading/loading.vue";
export default {
    name: "slide-table",
    components: {
        kldPage,
        kldLoading
    },
    data() {
        return {
            focusIndex: -1,
            clickIndex: -1,
            clickKey: null
        };
    },
    watch: {
        data: {
            handler(newData) {
                if (newData.length && this.clickKey && this.rowKey) {
                    this.clickIndex = newData.findIndex(
                        v => v[this.rowKey] === this.clickKey
                    );
                }
                this.$nextTick(() => {
                    if (!this.$refs["row-td"]) {
                        return;
                    }
                    let totalWidth =
                        parseFloat(
                            window.getComputedStyle(
                                this.$refs["asset-name-select"]
                            ).width
                        ) *
                        (1 / this.columns.length);
                    this.$refs["row-td"].forEach(element => {
                        if (!element.style.width) {
                            element.style.width = totalWidth - 25 + "px";
                        }
                    });
                });
            },
            immediate: true
        }
    },
    model: {
        prop: "value",
        event: "input"
    },
    props: {
        rowKey: String,
        slideShow: {
            default: false
        },
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        placeholder: String,
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        timeOut: {
            type: Boolean,
            default: false
        },
        page: {
            type: [Boolean, Object],
            validator: function(value) {
                function isDefined(flag) {
                    return flag !== undefined && flag !== null;
                }
                if (value) {
                    return (
                        isDefined(value["total"]) &&
                        isDefined(value["current"]) &&
                        isDefined(value["size"])
                    );
                } else {
                    return true;
                }
            }
        },
        value: {
            type: String,
            default: ""
        },
        showHead: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        inputValue: {
            get() {
                return this.value;
            },
            set(newValue) {
                this.$emit("input", newValue);
            }
        }
    },

    methods: {
        handleKeydown(e) {
            if (this.slideShow && this.data.length) {
                const keyCode = e.keyCode;
                // next
                if (keyCode === 40) {
                    e.preventDefault();
                    this.navigateOptions("next");
                }
                // prev
                if (keyCode === 38) {
                    e.preventDefault();
                    this.navigateOptions("prev");
                }
                //preCode
                if (keyCode === 37) {
                    //  e.preventDefault();
                    let prePage = this.page.current - 1;
                    prePage = prePage < 1 ? 1 : prePage;
                    this.pageChange(prePage);
                }
                //nextCode
                if (keyCode === 39) {
                    // e.preventDefault();
                    let prePage = this.page.current + 1;
                    let totalPage = Math.ceil(this.page.total / this.page.size);
                    prePage = prePage > totalPage ? totalPage : prePage;
                    this.pageChange(prePage);
                }
                // enter
                if (keyCode === 13) {
                    e.preventDefault();
                    if (this.focusIndex >= 0) {
                        this.getTrInfo(
                            this.data[this.focusIndex],
                            this.focusIndex
                        );
                    }
                }
            }
        },
        searchChange(...arg) {
            this.focusIndex = 0;
            this.$emit("on-change", ...arg);
        },
        searchFocus(...arg) {
            this.focusIndex = 0;
            this.$emit("on-focus", ...arg);
        },
        navigateOptions(direction) {
            if (direction === "next") {
                // console.log(this.focusIndex);
                let next = this.focusIndex + 1;
                this.focusIndex =
                    this.focusIndex === this.data.length - 1 ? 0 : next;
            } else if (direction === "prev") {
                let prev = this.focusIndex - 1;
                this.focusIndex =
                    this.focusIndex <= 0 ? this.data.length - 1 : prev;
            }
            this.resetScrollTop();
        },
        resetScrollTop() {
            const index = this.focusIndex;
            if (!this.data.length) return;
            let bottomOverflowDistance =
                this.$refs[`asset-li-${index}`][0].getBoundingClientRect()
                    .bottom -
                this.$refs["asset-ul"].getBoundingClientRect().bottom;
            let topOverflowDistance =
                this.$refs[`asset-li-${index}`][0].getBoundingClientRect().top -
                this.$refs["asset-ul"].getBoundingClientRect().top;

            if (bottomOverflowDistance > 0) {
                this.$refs["asset-ul"].scrollTop += bottomOverflowDistance;
            }
            if (topOverflowDistance < 0) {
                this.$refs["asset-ul"].scrollTop += topOverflowDistance;
            }
        },
        getTrInfo(...arg) {
            this.focusIndex = -1;
            if (this.rowKey) {
                this.clickKey = arg[0][this.rowKey];
            }
            this.$emit("row-in-click", ...arg);
        },
        pageChange(page) {
            this.focusIndex = 0;
            this.$emit("page-change", page);
        }
    }
};
</script>
<style lang="less" scoped>
.slide-table-input {
    position: relative;
    width: 100%;
}

.asset-name-select-wrap {
    position: absolute;
    z-index: 1000;
    width: 100%;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    border-radius: 5px;
    padding: 4px;
    .asset-name-select-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 6px;

        th,
        td {
            border: 1px solid #dddee1;
        }
        @raduis: 5px;
        thead {
            tr {
                th:first-child {
                    border-radius: @raduis 0 0 0;
                }
                th:last-child {
                    border-radius: 0 @raduis 0 0;
                }
            }
        }
        tbody {
            tr:last-child {
                td:first-child {
                    border-radius: 0 0 0 @raduis;
                }
                td:last-child {
                    border-radius: 0 0 @raduis 0;
                }
            }
        }
        // .ivu-select-item:hover{
        //     .asset-td{
        //         background-color: #fafafa;
        //     }
        // }
    }
    .asset-name-time-out-wrap {
        height: 100px;
        width: 100%;
        .asset-name-time-out {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .time-out-icon {
                margin-right: 5px;
                font-size: 30px;
            }
            .asset-name-refresh {
                text-decoration: underline;
            }
        }
    }
}
.focus-li {
    .asset-td {
        background-color: #f3f3f3;
    }
}
.click-li {
    .asset-td {
        color: #fff;
        background: rgba(45, 140, 240, 0.9);
    }
}
</style>



