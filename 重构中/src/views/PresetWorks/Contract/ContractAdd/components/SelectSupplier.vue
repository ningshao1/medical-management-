<template>
    <select-table
            v-model="valueProxy"
            class="select-supplier"
            :data="data"
            :columns="columns"
            :loading="loading"
            :current-page.sync="page.current"
            :total="page.total"
            :page-size="page.size"
            @current-change="getList"
            label-key="supplierName"
            remote
            :remote-method="remoteMethod"
            filterable
            object-mode
            width="400px"
    >
        <text-ellipsis slot="name" slot-scope="{row}">{{row.supplierName}}</text-ellipsis>
        <text-ellipsis slot="person" slot-scope="{row}">{{row.supplierContactName}}</text-ellipsis>
        <text-ellipsis slot="phone" slot-scope="{row}">{{row.supplierPhone}}</text-ellipsis>
    </select-table>
</template>

<script>
    import {List} from '@/mixins';
    import {TextEllipsis, SelectTable} from '@/components';
    export default {
        name: "select-supplier",
        mixins: [List],
        components: {
            SelectTable,
            TextEllipsis
        },
        props: {
            value: {},
        },
        data() {
            return {
                search: {
                    keyword: ''
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
            url() {
                return '/supplier/list';
            },
            columns() {
                return [
                    {
                        title: '检定单位',
                        key: 'supplierName',
                        slot: 'name'
                    },
                    {
                        title: '联系人',
                        width: '100px',
                        slot: 'person'
                    },
                    {
                        title: '联系方式',
                        width: '100px',
                        slot: 'phone'
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .select-supplier {

    }
</style>