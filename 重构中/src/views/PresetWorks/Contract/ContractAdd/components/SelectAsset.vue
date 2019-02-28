<template>
    <select-table
            v-model="valueProxy"
            remote
            filterable
            :remote-method="remoteMethod"
            :loading="loading"
            object-mode
            class="SelectAsset"
            label-key="assetName"
            :columns="columns"
            :data="data"
            :current-page.sync="page.current"
            :total="page.total"
            :page-size="page.size"
            @current-change="getList"
            width="500px"
    >
        <text-ellipsis
                v-for="{slot, key} in columns"
                :slot="slot"
                :key="key"
                slot-scope="{row}"
        >{{row[key]}}</text-ellipsis>
    </select-table>
</template>

<script>
    import {SelectTable, TextEllipsis} from '@/components';
    import {List} from '@/mixins';
    export default {
        name: "SelectAsset",
        mixins: [List],
        components: {
            SelectTable,
            TextEllipsis
        },
        props: {
            value: {}
        },
        data() {
            return {
                search: {
                    keyword: null,
                }
            };
        },
        computed: {
            valueProxy: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                }
            },
            hospitalId() {
                return this.$store.state.userInfo.osId;
            },
            url() {
                return `/assets/${this.hospitalId}/list`;
            },
            columns() {
                return [
                    {
                        title: '设备名称',
                        key: 'assetName',
                        slot: 'name'
                    },
                    {
                        title: '型号',
                        key: 'assetClass',
                        slot: 'info'
                    },
                    {
                        title: '品牌',
                        key: 'brandName',
                        slot: 'brand'
                    },
                    {
                        title: '所属科室',
                        key: 'osName',
                        slot: 'department'
                    },
                    {
                        title: '过保时间',
                        key: 'assetWarrntyDate',
                        slot: 'date'
                    }
                ]
            }
        },
        created() {
            this.getList();
        },
        methods: {
            remoteMethod(value) {
                this.search.keyword = value;
            },
        }
    }
</script>