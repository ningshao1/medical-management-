<template>
    <Select
            v-model="valueProxy"
            :remote-method="searchMethod"
            :loading="tableLoading"
            :disabled="disabled"
            :placeholder="placeholder"
            remote
            filterable
            ref="select"
            class="asset-select kld-select"
    >
        <Option v-if="tableData.length > 0" value="" :label="searchData.keyword" disabled key="head">
            <Row class="kld-default" :gutter="10">
                <i-col span="18">设备名称</i-col>
                <i-col span="6">设备编码</i-col>
            </Row>
        </Option>
        <Option
                v-for="{assetId: id, assetName: name, assetCode: code} in tableData"
                :value="id"
                :label="name"
                :key="id"
        >
            <Row :gutter="10">
                <i-col span="18">
                    <p class="text-ellipsis" :title="name">{{name}}</p>
                </i-col>
                <i-col span="6">
                    <p class="text-ellipsis" :title="code">{{code}}</p>
                </i-col>
            </Row>
        </Option>
        <Option v-if="tableData.length > 0" value="" :label="searchData.keyword" disabled key="page">
            <kld-page
                    size="small"
                    :current.sync="pageData.current"
                    :page-size="pageData.pageSize"
                    :total="pageData.total"
                    @on-change="getTableData"
            ></kld-page>
        </Option>
    </Select>
</template>

<script>
    import list from '../large-equipment/common/list';
    import KldPage from '@/common/page';
    import Vue from 'vue';

    const newSelect = Vue.component('Select').extend({
        methods: {
            validateOption(/*{children, elm, propsData}*/){
                return true;
                // if (this.queryStringMatchesSelectedOption) return true;
                // const value = propsData.value;
                // const label = propsData.label || '';
                // const textContent = (elm && elm.textContent) || (children || []).reduce((str, node) => {
                //     const nodeText = node.elm ? node.elm.textContent : node.text;
                //     return `${str} ${nodeText}`;
                // }, '') || '';
                // const stringValues = JSON.stringify([value, label, textContent]);
                // const query = this.query.toLowerCase().trim();
                // return stringValues.toLowerCase().includes(query);
            }
        }
    });

    export default {
        name: "asset-select",
        mixins: [list],
        components: {
            KldPage,
            Select: newSelect
        },

        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            placeholder: String,
            disabled: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                searchData: {
                    keyword: ''
                }
            };
        },

        computed: {
            tableUrl() {
                return '/internetThings/getAsset';
            },

            valueProxy: {
                get() {
                    return this.value;
                },
                set(v) {
                    this.$emit('input', v === undefined ? '' : v);
                }
            }
        },

        watch: {
            value(value) {
                if (! value) {
                    this.setQuery('');
                }
            }
        },

        created() {
            this.getTableData();
        },

        methods: {
            searchMethod(query = '') {
                if (query !== '' && query === this.value) {
                    return;
                }
                this.searchData.keyword = query;
            },
            setQuery(query) {
                ! query && (query = '');

                //逼我用的，不然有的数据无法回显
                setTimeout(() => {
                    this.$refs.select.query = query;
                });
                this.searchMethod(query);
            }
        }
    }
</script>

<style lang="less" scoped>
    .asset-select {
        /deep/ .ivu-select-dropdown{
            max-height: 260px
        }
    }
</style>