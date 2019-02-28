<template>
    <Modal v-model="typeShow"
           title="选择资产打印"
           width='1000'>
        <div>
            <Row>
                <Col span="8">
                <div class="tree">
                    <kld-search-tree placeholder="请输入科室名">
                        <kld-tree v-model="formData.osIds"
                                  slot="tree"
                                  :data='TreeData'
                                  :showCheckbox="true"
                                  :nodeKey='"id"'
                                  :firstExpanded='true'
                                  :childrenKey='"lists"'
                                  :titleKey='"osName"'>
                        </kld-tree>
                    </kld-search-tree>

                </div>
                </Col>
                <Col span="16">
                <div class="tree list-table">
                    <Input placeholder="请输入资产名称"
                           v-model="formData.keyword"></Input>
                    <table class="table-stripe "
                           width="100%"
                           border="1"
                           style="border-collapse:collapse">
                        <tr>
                            <th style="width:70px;">
                                <Checkbox :disabled='listData.length<=0'
                                          :indeterminate='indeterminate'
                                          v-model="AllCheck"
                                          @on-change='allcheckHandler'><i></i></Checkbox>
                            </th>
                            <th style="width:300px;">资产名称</th>
                            <th>资产编码</th>
                        </tr>
                        <tr v-for='(item,index) in listData'
                            :key='index'>
                            <td>
                                <Checkbox v-model="item.check"
                                          @on-change='selectHandler($event,item)'></Checkbox>
                            </td>
                            <td style="width:200px;">
                                <p class="equipment-title"
                                   :title="item.assetName">{{item.assetName}}</p>
                            </td>

                            <td>{{item.assetCode | upc}}</td>
                        </tr>
                    </table>
                </div>
                </Col>
            </Row>
        </div>
        <div slot='footer'
             class="foot">
            <div>
                点击取消可以重新选择二维码尺寸
            </div>
            <div>
                <Button type="text"
                        @click="cancel">取消</Button>
                <Button class="kld-btn"
                        @click="jump">确定</Button>
            </div>
        </div>
    </Modal>
</template>
<script>
import kldTree from "@common/kld-tree/kld-tree.vue";
import searchTree from "@common/kld-search-tree";
export default {
    name: "asset-list-choose",
    props: ["type", "printTypeShow"],
    data() {
        return {
            typeShow: false,
            TreeData: [],
            listData: [],
            selectData: [],
            AllCheck: false,
            indeterminate: false,
            formData: {
                osIds: [],
                hosId: this.$store.state.user_in.osId,
                keyword: ""
            }
        };
    },
    components: {
        [kldTree.name]: kldTree,
        [searchTree.name]: searchTree
    },
    computed: {
        parentShow: {
            get() {
                return this.printTypeShow;
            },
            set(val) {
                this.$emit("update:printTypeShow", val);
            }
        }
    },
    watch: {
        "formData.osIds"() {
            this.getListData();
        },
        "formData.keyword"() {
            this.getListData();
        },
        selectData(val) {
            this.state(val);
        },
        typeShow(val) {
            if (val) this.getListData();
        }
    },
    created() {
        this.getTreeData();
        this.getListData();
    },
    methods: {
        getListData() {
            if (!this.typeShow) return;
            this.$axios
                .post(`assets/getAssetCodes`, this.formData)
                .then(({ data }) => {
                    const temp = data instanceof Array ? data : [];
                    this.selectData.map(v => {
                        const index = temp.findIndex(e => e.id === v.id);
                        if (index <= -1) return;
                        temp[index]["check"] = true;
                    });
                    this.listData = temp;
                    this.state();
                    this.$forceUpdate();
                });
        },
        getTreeData() {
            this.$axios
                .get(`orgstruct/findAllTree/${this.formData.hosId}`)
                .then(({ data }) => {
                    this.TreeData = [data];
                });
        },
        selectHandler(data, item) {
            if (data) {
                this.selectData.push(item);
            } else {
                const index = this.selectData.findIndex(v => v.id === item.id);
                index > -1 ? this.selectData.splice(index, 1) : "";
            }
        },
        allcheckHandler(val) {
            if (val) {
                const TempArray = [];
                TempArray.push(...this.listData, ...this.selectData);
                this.selectData = this.arrayUnique(TempArray); //数组去重
                this.listData.map(v => {
                    v["check"] = true;
                });
            } else {
                this.listData.map(v => {
                    const index = this.selectData.findIndex(e => e.id === v.id);
                    if (index <= -1) return;
                    this.selectData.splice(index, 1);
                });
                this.listData.map(v => {
                    // v["check"] = false;
                    this.$set(v, "check", false);
                });
            }
        },
        cancel() {
            this.typeShow = false;
            this.parentShow = true;
        },
        jump() {
            if (this.selectData.length <= 0) {
                this.$Message.warning("请选择需要打印的二维码");
                return;
            }
            console.log(this.selectData.map(v => v.id));
            this.$router.push({
                name: "print-new-QR",
                query: {
                    type: this.type + "",
                    assetIds: this.selectData.map(v => v.id)
                }
            });
        },
        //数组去重
        arrayUnique(arr, only = "id") {
            var hash = {};
            var newArr = [];
            newArr = arr.reduce(function(item, next) {
                hash[next[only]]
                    ? ""
                    : (hash[next[only]] = true && item.push(next));
                return item;
            }, []);
            return newArr;
        },
        //状态修改
        state(val = this.selectData) {
            let [check, nocheck] = [false, false];
            this.listData.map(v => {
                const index = val.findIndex(e => e.id === v.id);
                if (index <= -1) nocheck = true;
                else check = true;
            });
            if (check && nocheck) {
                this.indeterminate = true; //半选状态
                this.AllCheck = false;
            } else if (check === true && nocheck === false) {
                this.indeterminate = false;
                this.AllCheck = true;
            } else if (check === false && nocheck === true) {
                this.indeterminate = false;
                this.AllCheck = false;
            } else if (check === false && nocheck === false) {
                this.indeterminate = false;
                this.AllCheck = false;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.tree {
    height: 600px;
}
.list-table {
    height: 600px;
    overflow: auto;
    table {
        tr {
            td:nth-of-type(1),
            th:nth-of-type(1) {
                padding-left: 10px;
            }
        }
    }
}
table {
    border: none;
    table-layout: fixed;
    tr:nth-child(1) {
        height: 40px;
    }
    tr:last-child {
        border: none;
    }
    tr {
        border: none;
        border-bottom: solid 1px rgba(2, 31, 57, 0.1);
        //height: 80px;

        text-align: left;
        font-size: 14px;
        &:not(.one):hover {
            background: #f2f2f2;
            cursor: pointer;
        }
        th {
            color: #666666;
            border: none;
        }
        td {
            padding: 10px 5px 10px 5px;
            border: none;
            font-size: 12px;
            span {
                font-size: 12px;
                color: #999999;
            }
        }
        > th:nth-last-child {
            text-align: center;
        }
        > td:nth-last-child {
            text-align: center;
        }
    }
}
.foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
