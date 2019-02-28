<template>
    <div class="float-table-input"
         v-clickoutside="clickoutside">
        <i-input class="kld-input"
                 @on-change='searchChange($event)'
                 @on-focus="searchFocus"
                 v-model="inputValue"
                 ref="search-input"
                 clearable
                 @on-keydown='handleKeydown'
                 :placeholder="placeholder"></i-input>
        <transition name="slide-up">
            <div class="asset-name-select-wrap"
                 v-show="floatShow&&tableData.length"
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
                                <td class="asset-td"
                                    v-for="(item,index) of columns"
                                    :title='v[item.key]'
                                    :key="item.key+index"
                                    style='text-align:center;padding:10px;'>
                                    <div class='textEllipsis'
                                         ref="row-td">
                                        {{v[item.key]}}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
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
    name: "float-table",
    components: {
        kldPage,
        kldLoading
    },
    data() {
        return {
            focusIndex: -1,
            clickIndex: -1,
            clickKey: null,
            floatShow: false,
            loading: false,
            timeOut: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            }
        };
    },

    model: {
        prop: "value",
        event: "input"
    },
    props: {
        rowKey: String,
        //远端请求地址
        keyWordRemote: {
            type: Object,
            default: null
        },
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        placeholder: String,
        columns: {
            type: Array,
            default() {
                return [];
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
                if (!newValue) {
                    this.floatShow = false;
                }
                this.$emit("input", newValue);
            }
        },
        tableData: {
            get() {
                if (!this.data) {
                    return [];
                }
                if (this.data.length && this.clickKey && this.rowKey) {
                    this.clickIndex = this.data.findIndex(
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
                return this.data;
            },
            set(data) {
                this.$emit("update:data", data);
            }
        }
    },

    methods: {
        handleKeydown(e) {
            if (this.floatShow && this.tableData.length) {
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
                            this.tableData[this.focusIndex],
                            this.focusIndex
                        );
                    }
                }
            }
        },
        searchChange(e) {
            this.focusIndex = 0;
            // this.$emit("on-change", ...arg);
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                // this.focusIndex = 0;
                if (e.target.value) {
                    this.page.current = 1;
                    this.remoteMethod(e.target.value);
                } else {
                    this.tableData = [];
                }
            }, 300);
        },
        searchFocus(...arg) {
            if (this.inputValue) {
                this.pageChange();
            }
            // this.$emit("on-focus", ...arg);
        },
        clickoutside() {
            this.floatShow = false;
        },
        navigateOptions(direction) {
            if (direction === "next") {
                // console.log(this.focusIndex);
                let next = this.focusIndex + 1;
                this.focusIndex =
                    this.focusIndex === this.tableData.length - 1 ? 0 : next;
            } else if (direction === "prev") {
                let prev = this.focusIndex - 1;
                this.focusIndex =
                    this.focusIndex <= 0 ? this.tableData.length - 1 : prev;
            }
            this.resetScrollTop();
        },
        resetScrollTop() {
            const index = this.focusIndex;
            if (!this.tableData.length) return;
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
            this.floatShow = false;
            this.$emit("row-in-click", ...arg);
        },
        pageChange(page = 1) {
            this.focusIndex = 0;
            this.page.current = page;
            // this.$emit("page-change", page);
            this.remoteMethod(this.inputValue);
        },
        remoteMethod(keyWord) {
            this.loading = true;
            this.timeOut = false;
            this.floatShow = true;
            this.$axios
                .post(
                    `${this.keyWordRemote.url}`,
                    {
                        limit: this.page.size,
                        offset: this.page.size * (this.page.current - 1),
                        params: {
                            [this.keyWordRemote.params]: keyWord
                        }
                    },
                    {
                        timeout: 5000
                    }
                )
                .then(
                    res => {
                        this.page.total = res.data.recordsTotal;
                        this.$emit("remote-ready", res);
                    },
                    error => {
                        this.timeOut = true;
                    }
                )
                .finally(res => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="less" scoped>
.float-table-input {
    position: relative;
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



