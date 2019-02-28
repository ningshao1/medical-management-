<template>
    <div
        class="float-table-wrap"
        v-clickoutside="clickoutside"
    >
        <el-input
            v-bind="$attrs"
            v-model.trim="currentValue"
            @input="valueChange"
            @focus="inputFocus"
            @keydown.native="keydownHandler"
            clearable
            @clear="clearSelect"
        >

        </el-input>
        <transition name="el-zoom-in-top">
            <ul
                class="float-autocomplete-wrap"
                v-show="show"
                v-load="loading"
            >
                <li class="float-autocomplete-header">
                    <div>

                        <div
                            v-for="(v,i) of columns"
                            :key="i"
                            :style="columnWidth(columns,v)"
                        >
                            {{v.title}}
                        </div>
                    </div>
                </li>
                <template v-if="!data.length&&!loading">
                    <li class="no-data-item">
                        {{noDataText}}
                    </li>
                </template>
                <template v-else>
                    <template v-for="(item,i) of data">
                        <li
                            :key="i"
                            @click="querySelect(item)"
                            :class="{'float-autocomplete-item':true,'float-autocomplete-item-focus':i===focusIndex}"
                        >
                            <div>
                                <template v-for="(v,index) of columns">
                                    <div
                                        :key="index"
                                        :style="columnWidth(columns,v)"
                                        v-ellipsis-tooltip="item[v.key]"
                                    >
                                        {{item[v.key]||"--"}}
                                    </div>
                                </template>
                            </div>
                        </li>
                    </template>
                </template>

                <li class="float-autocomplete-footer">
                    <el-pagination
                        :page-size="page.pageSize"
                        small
                        :current-page="page.currentPage"
                        @current-change="currentChange"
                        :total="page.total"
                        layout="prev, pager, next"
                    >

                    </el-pagination>
                </li>

            </ul>
        </transition>
    </div>
</template>
<script>
export default {
    name: "float-table",
    components: {},
    props: {
        mode: {
            default: "autocomplete" // modes:'autocomplete' 'select'
        },
        value: {
            default: ""
        },
        columns: {
            default() {
                return [];
            }
        },
        remoteMethod: Function,
        valueKey: {
            default: "value"
        },
        nodeKey: {
            default: null
        },
        remoteFocus: {
            type: Boolean,
            default: true
        },
        noDataText: {
            type: [Boolean, String],
            default: "暂无数据"
        },


        remoteNoKeyword: Boolean,
        selectedItem:{
            default:"[no data]",
            type:[Object,String,Number]
        }
    },
    data() {
        return {
            show: false,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            data: [],
            loading: false,
            innerValue:'',

            //keyboard
            focusIndex: -1,
            selectedValue: ""
        };
    },
    computed: {
        currentValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        },
        isSelectMode(){
            return this.selectedItem!=="[no data]";
        },
        isSelectedObject(){
            return Object.prototype.toString.call(this.selectedItem)==="[object Object]";
        },
        _selectedItem:{
            get(){
                return this.selectedItem;
            },
            set(val){
                this.$emit("update:selectedItem",val)
            }
        }
    },
    watch:{
        _selectedItem:{
            handler(val){
                if(!this.isSelectMode){
                    this.$off("_selectedItem");
                    return;
                }
                if(this.isSelectedObject){
                    this.currentValue=this.selectedItem[this.valueKey];
                }else{
                    this.currentValue = this.selectedItem;
                }
            },
            deep:true,
            immediate:true
        }
    },
    created() {},
    methods: {
        resetFocus() {
            this.focusIndex = -1;
        },
        clickoutside() {
            this.show = false;
            if (!this.isSelectMode) {
                return ;
            }
            if(this.isSelectedObject){
                this.currentValue=this._selectedItem[this.valueKey];

            }else{

                this.currentValue = this._selectedItem;
            }
            // if (this.mode === "select") {
            //     this.currentValue = this.selectedValue;
            // }
        },
        valueChange(e) {
            if (!e && !this.remoteNoKeyword) {
                this.show = false;
                return;
            }
            this.queryRemote(e);
        },
        clearSelect() {
            this.reset();
        },
        reset() {
            this.currentValue = "";
            if(!this.isSelectMode){
                return
            }
            if(this.isSelectedObject){
                this._selectedItem={
                    [this.nodeKey]:null,
                    [this.valueKey]:""
                }
            }else{
                this._selectedItem='';
            }
        },
        querySelect(v) {
            this.resetFocus();
            this.show = false;
            this.currentValue = v[this.valueKey];

            if(this.isSelectMode){
                if(this.isSelectedObject){
                    this._selectedItem={
                        [this.nodeKey]:v[this.nodeKey],
                        [this.valueKey]:v[this.valueKey]
                    }
                }else{
                    this._selectedItem=v[this.valueKey];
                }




            }


            // this.selectedValue = v[this.valueKey];
            // if (this.nodeKey) {
            //     this.currentKey = v[this.nodeKey];
            // }
            this.$emit("select", v);
        },
        inputFocus(e) {
            if (this.show) {
                return;
            }
            if (!this.remoteFocus) {
                return;
            }
            if (!this.currentValue && !this.remoteNoKeyword) {
                return;
            }
            const {
                target: { value }
            } = e;
            this.queryRemote(value);
        },
        keydownHandler(e) {
            const { keyCode } = e;
            if ([38, 40, 13].includes(keyCode)) {
                e.preventDefault();
            }
            if (keyCode === 38 && this.focusIndex >= 0) {
                this.focusIndex--;
                return;
            }
            if (keyCode === 40 && this.focusIndex < this.data.length - 1) {
                this.focusIndex++;
                return;
            }
            if (keyCode === 13 && this.focusIndex >= 0) {
                this.querySelect(this.data[this.focusIndex]);
            }
        },
        queryRemote(keyword, currentPage = 1) {
            if (!this.remoteMethod) {
                return;
            }
            this.resetFocus();
            this.show = true;
            this.loading = true;
            this.page.currentPage = currentPage;
            this.remoteMethod(keyword, this.page, this.remoteBack);
        },
        remoteBack(back) {
            this.loading = false;
            if (!back) {
                return;
            }
            const { data, recordsTotal } = back;
            this.data = data;
            this.page.total = recordsTotal;
        },
        
        //后端保证有值
        // setKeyNode(currentKey, currentValue) {
        //     this.currentValue = currentValue;
        //     this.selectedValue = currentValue;
        //     this.currentKey = currentKey;
        // },
        columnWidth(columns, column) {
            const style = {
                width: `${100 / columns.length}%`,
                "text-align": "center"
            };
            return {
                ...style
            };
        },
        currentChange(current) {
            this.queryRemote(this.currentValue, current);
        }
    }
};
</script>
<style lang="scss" scoped>
.float-table-wrap {
    position: relative;
    .float-autocomplete-wrap {
        width: 100%;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        margin-top: 2px;
        position: absolute !important;
        z-index: 10000;
        background-color: #fff;
        padding: 3px 1px;
        $--focus-background: #f5f7fa;
        @mixin column-style($font-size) {
            font-size: $font-size;
            line-height: $font-size;
            > div {
                width: 100%;
                display: flex;
            }
        }
        > .float-autocomplete-header {
            font-weight: 600;
            padding: 10px 10px;
            border-bottom: solid 1px #ebebeb;
            @include column-style(14px);
        }
        > .float-autocomplete-item {
            padding: 10px 10px;
            cursor: pointer;
            @include column-style(12px);
            &:hover {
                background-color: $--focus-background;
            }
            &.float-autocomplete-item-focus {
                background-color: $--focus-background;
            }
        }
        > .float-autocomplete-footer {
            line-height: 16px;
            padding: 6px 0;

            display: flex;
            justify-content: center;
        }
        > .no-data-item {
            text-align: center;
            padding: 10px;
        }
    }
}
</style>