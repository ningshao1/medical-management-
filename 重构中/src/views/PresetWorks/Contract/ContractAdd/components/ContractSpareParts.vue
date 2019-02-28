<template>
    <increment-list
            class="contract-spare-parts"
            v-model="valueProxy"
            :slots="slots"
            ref="increment-list"
            button-text="新增备件"
    >
        <increment-list-item slot="name" label="备件名称" slot-scope="{item}">
            <el-input v-model="item.sparePartName" :disabled="!hasAsset" placeholder="请输入备件名称"></el-input>
        </increment-list-item>
        <increment-list-item slot="model" slot-scope="{item}">
            <template slot="label">备件型号<Asterisk class="pl-4"></Asterisk></template>
            <el-input v-model="item.sparePartModel" :disabled="!item.sparePartName" placeholder="请输入备件型号"></el-input>
        </increment-list-item>
        <increment-list-item slot="asset" slot-scope="{item}">
            <template slot="label">所属设备<Asterisk class="pl-4"></Asterisk></template>
            <el-select v-model="item.assetId" :disabled="!item.sparePartName" placeholder="请选择所属设备">
                <el-option
                        v-for="{assetId, assetName} in assets"
                        :key="assetId"
                        :label="assetName"
                        :value="assetId"
                ></el-option>
            </el-select>
        </increment-list-item>
        <increment-list-item slot="amount" slot-scope="{item}">
            <template slot="label">备件数量<Asterisk class="pl-4"></Asterisk></template>
            <kld-input-number
                    v-model="item.sparePartNum"
                    :min="0"
                    :percision="0"
                    :disabled="!item.sparePartName"
                    placeholder="请输入备件数量"
            ></kld-input-number>
        </increment-list-item>
    </increment-list>
</template>

<script>
    import {default as IncrementList, IncrementListItem} from './IncrementList';
    import {Asterisk, KldInputNumber} from '@/components';
    export default {
        name: "contract-spare-parts",
        components: {
            IncrementList,
            IncrementListItem,
            Asterisk,
            KldInputNumber,
        },
        props: {
            value: {},
            assets: {
                type: Array,
                default() {
                    return [];
                }
            }
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
                return ['name', 'model', 'asset', 'amount'];
            },
            hasAsset() {
                return this.assets.length > 0;
            },
        },
        watch: {
            assets(assets) {
                const value = this.valueProxy;
                const newValue = value.filter(
                    ({assetId}) => assets.some(({assetId: id}) => id === assetId)
                );

                if (value.length !== newValue.length) {
                    this.valueProxy = newValue;
                }
            }
        }
    }
</script>