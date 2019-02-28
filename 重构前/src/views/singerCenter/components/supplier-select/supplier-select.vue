<template>
    <Select
            :value="value"
            @input="selectInputHandler"
            class="supplier-select"
            filterable
            transfer
            remote
            :remote-method="searchMethod"
            :placeholder="placeholder"
            :loading="searchLoading"
    >
        <i-button v-show="false" ref="button"></i-button>
        <Option v-for="{id, supplierName: name} in supplierList" :value="id" :key="id">{{name}}</Option>
        <div v-if="scrollBottomLoading" class="scroll-bottom-loading">
            <Loading></Loading>
        </div>
    </Select>
</template>

<style lang="less" scoped>
    .supplier-select {
        /deep/.ivu-select-dropdown{
           position:fixed!important;
        }
    }
    .scroll-bottom-loading{
        position: relative;
        height: 50px;
    }
</style>

<script>
    import {debounce} from '@/utils';
    export default {
        name: "supplier-select",
        props: {
            value: [String, Number],
            placeholder: {
                type: String,
                default: '请选择供应商'
            },
            type: {
                type: [String, Number],
                default: '0'
            }
        },

        data() {
            return {
                searchValue: '',
                supplierList: [],
                searchLoading: false,
                scrollBottomLoading: false,
                recordsTotal:0
            };
        },

        computed: {
            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },

        created() {
            this.searchMethod();
            this.initScrollEvent();
        },


        methods: {
            async getSupplierData(offset) {
                const {data: {data,recordsTotal}} = await this.$axios.post('/supplier/listSupplierReport', {
                        offset: offset,
                        limit: 10,
                        params: {
                            keyword: this.searchValue,
                            osId: this.hospitalId
                        }
                    });
                this.recordsTotal=recordsTotal;
                return data;
            },


            initScrollEvent() {
                this.$nextTick(() => {
                    const $scrollWrap = this.$refs["button"].$parent.$el,
                         handler = debounce(() => {
                            if ($scrollWrap.scrollHeight - ($scrollWrap.scrollTop + $scrollWrap.clientHeight) < 3&&this.supplierList.length<this.recordsTotal) {
                                this.whenScrollBottom();
                            }
                        }, 200);

                    $scrollWrap.addEventListener('scroll', handler);

                    this.$once('hook:beforeDestroy', () => {
                        $scrollWrap.removeEventListener('scroll', handler);
                    })
                })
            },


            async whenScrollBottom() {
                this.scrollBottomLoading = true;
                try {
                    const {supplierList} = this,
                        data = await this.getSupplierData(supplierList.length);

                    supplierList.push(...data);
                } finally {
                    this.scrollBottomLoading = false;
                }
            },


            searchMethod: debounce(async function (value) {
                this.searchLoading = true;
                this.searchValue = value;
                try {
                    this.supplierList = await this.getSupplierData(0);
                } finally {
                    this.searchLoading = false;
                }
            }, 200),

            selectInputHandler(value) {
                this.$emit('input', value);
            }
        }
    }
</script>