<template>
    <increment-list v-model="valueProxy" class="contract-assets" :slots="slots" button-text="新增设备">
        <increment-list-item slot="id" slot-scope="{item, index}">
            <template slot="label">
                设备名称<Asterisk class="pl-4"></Asterisk>
            </template>
            <select-asset :value="getAsset(item)" @input="setItem(item, $event)" placeholder="请选择资产"></select-asset>
        </increment-list-item>
        <increment-list-item slot="brand" label="设备品牌" slot-scope="{item}">
            <el-input :value="item.brandName" disabled placeholder="系统自动代入"></el-input>
        </increment-list-item>
        <increment-list-item slot="model" label="设备型号" slot-scope="{item}">
            <el-input :value="item.assetClass" disabled placeholder="系统自动代入"></el-input>
        </increment-list-item>
        <increment-list-item slot="date" slot-scope="{item}">
            <template slot="label">
                过保日期<Asterisk class="pl-4"></Asterisk>
            </template>
            <el-date-picker
                    v-model="item.assetWarrntyDate"
                    placeholder="请选择过保日期"
                    :disabled="!item.assetId"
            ></el-date-picker>
        </increment-list-item>
    </increment-list>
</template>

<script>
    import {IncrementListItem, default as IncrementList} from './IncrementList';
    import SelectAsset from './SelectAsset';
    import {Asterisk} from '@/components';
    export default {
        name: "contract-assets",
        components: {
            IncrementList,
            IncrementListItem,
            Asterisk,
            SelectAsset
        },
        props: {
            value: {}
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

            slots() {
                return ['id', 'brand', 'model', 'date'];
            }
        },
        methods: {
            getAsset(item) {
                return {
                    id: item.assetId,
                    assetName: item.assetName
                };
            },
            setItem(item, asset) {
                this.$set(item, 'assetId', asset.id);
                this.$set(item, 'assetWarrntyDate', asset.assetWarrntyDate);
                this.$set(item, 'departmentId', asset.departmentId);
                this.$set(item, 'hosId', asset.hosId);

                this.$set(item, 'assetName', asset.assetName);
                this.$set(item, 'brandName', asset.brandName);
                this.$set(item, 'assetClass', asset.assetClass);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contract-assets {

    }
</style>