<template>
    <div class="dropdown-dictionary-wrap"
         v-clickoutside="clickoutside">
        <i-input type="textarea"
                 v-bind="$attrs"
                 :autosize='autosize'
                 :maxlength='200'
                 @on-focus='onfocus'
                 v-model="keyworld"
                 @on-change='onchange'></i-input>
        <transition name="slide-up">
            <div class="dropdown-dictionary-list"
                 v-show="visible&&!!tableData.length">
                <simple-table :columns="columns"
                              :data='tableData'
                              :loading="loading"
                              class="dropdown-dictionary-table"
                              @row-in-click="rowInClick"></simple-table>
                <kld-page :current="page.current"
                          :total="page.total"
                          :page-size="page.size"
                          style="margin-top:15px;"
                          @on-change="loadList(keyworld,$event)"></kld-page>
                <i-button type="text"
                          class="dropdown-dictionary-btn"
                          @click="visible=false">
                    关闭
                </i-button>

            </div>
        </transition>
    </div>
</template>

<script>
import simpleTable from "@common/simple-table";
import kldPage from "@common/page";
export default {
    name: "dropdown-dictionary",
    components: { simpleTable, kldPage },
    data() {
        class type {
            constructor(label, key, url, idKey) {
                this.label = label;
                this.key = key;
                this.url = url;
                this.idField = key + "Id";
            }
        }
        return {
            visible: false,
            types: {
                //故障类型
                faultType: new type(
                    "故障类型",
                    "faultType",
                    "fault/listFaultType"
                ),
                //故障现象
                faultPhenomenon: new type(
                    "故障现象",
                    "faultPhenomenon",
                    "fault/listFaultPhenomenon"
                ),
                //处理方案
                faultProcess: new type(
                    "处理方案",
                    "faultProcess",
                    "fault/listFaultProcess"
                )
            },
            tableData: [],
            loading: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            timer: null
        };
    },
    props: {
        autosize: {
            type: Object,
            default() {
                return { minRows: 3 };
            }
        },
        type: {
            type: String,
            required: true
        },
        content: {
            default: ""
        },
        id: {
            default: ""
        }
    },
    computed: {
        _type() {
            return this.types[this.type];
        },
        columns() {
            return [
                {
                    key: "index",
                    label: "序号",
                    width: "200px"
                },
                {
                    key: this._type["key"],
                    label: this._type["label"]
                }
            ];
        },
        url() {
            return this._type["url"];
        },
        //remote 字段
        paramsField() {
            return this._type["key"];
        },
        hosptialId() {
            return this.$store.state.user_in.osId;
        },
        keyworld: {
            get() {
                return this.content;
            },
            set(val) {
                this.$emit("update:content", val);
            }
        },
        typeId: {
            get() {
                return this.id;
            },
            set(val) {
                this.$emit("update:id", val);
            }
        }
    },
    created() {
        this.loadList();
    },
    methods: {
        async loadList(keyworld = "", page = 1) {
            this.page.current = page;
            this.loading = true;
            try {
                let reuqestBody = {
                    limit: this.page.size,
                    offset: (this.page.current - 1) * this.page.size,
                    params: {
                        hosptialId: this.hosptialId,
                        [this.paramsField]: keyworld
                    }
                };
                const {
                    data: { data, recordsTotal }
                } = await this.$axios.post(this.url, reuqestBody);
                this.tableData = data.map((v, i) => {
                    return {
                        ...v,
                        index: (this.page.current - 1) * 10 + i + 1
                    };
                });
                this.page.total = recordsTotal;
            } finally {
                this.loading = false;
            }
        },
        clickoutside() {
            this.visible = false;
        },
        onfocus() {
            this.visible = true;
            this.loadList(this.keyworld);
        },
        onchange(e) {
            this.typeId = "";
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                const {
                    target: { value }
                } = e;
                let keyworld = value.trim();
                this.loadList(keyworld);
            }, 400);
        },
        rowInClick(row) {
            if (row) {
                this.visible = false;
                this.keyworld = row[this._type.key];
                this.typeId = row[this._type.idField];
            }
        }
    }
};
</script>
<style lang="less" scoped>
.dropdown-dictionary-wrap {
    width: 100%;
    .ivu-dropdown {
        width: 100%;
    }
    .dropdown-dictionary-list {
        margin-top: 4px;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: 10000;
        background-color: #fff;
        .dropdown-dictionary-table {
            padding: 5px;
        }
        .dropdown-dictionary-btn {
            &:focus {
                box-shadow: none;
            }
        }
    }
}
</style>


