<template>
    <div class="contract-assets">
        <kld-type title="合同所含设备"/>
        <kld-type title="设备信息"/>
        <increment-list
                :columns="assetColumns"
                :items.sync="assetsProxy"
                :default-item-data="defaultAssetData"
                :editable="! disabled"
        >
            <template slot="name" slot-scope="{item}">
                <input-label>设备名称：</input-label>
                <Input
                        :value="item.assetName"
                        @on-focus="modalShow = true"
                        placeholder="请选择设备名称"
                        class="kld-input"
                        readonly
                        :disabled="disabled"
                />
            </template>
            <template slot="model" slot-scope="{item}">
                <input-label>设备型号：</input-label>
                <Input :value="item.assetClass" placeholder="请输入设备型号" class="kld-input" disabled/>
            </template>
            <template slot="brand" slot-scope="{item}">
                <input-label>设备品牌：</input-label>
                <Input :value="item.brandName" class="kld-input" placeholder="请输入设备品牌" disabled/>
            </template>
            <template slot="date" slot-scope="{item}">
                <input-label :required="item.id">过保日期：</input-label>
                <DatePicker
                        :value="item.assetWarrntyDate"
                        @on-change="item.assetWarrntyDate = $event"
                        class="kld-date-picker"
                        placeholder="请选择过保日期"
                        :disabled="disabled || ! item.id"
                />
            </template>
        </increment-list>

        <kld-type title="备件信息"/>
        <increment-list
                :items.sync="sparePartsProxy"
                :columns="sparePartsColumns"
                :default-item-data="defaultSparePartData"
                :editable="! disabled"
        >
            <template slot="name" slot-scope="{item}">
                <input-label>备件名称：</input-label>
                <Input
                        v-model="item.sparePartName"
                        placeholder="请输入设备型号"
                        class="kld-input"
                        :disabled="disabled || effectAssets.length === 0"
                />
            </template>
            <template slot="model" slot-scope="{item}">
                <input-label :required="item.sparePartName">备件型号：</input-label>
                <Input
                        v-model="item.sparePartModel"
                        placeholder="请输入设备型号"
                        class="kld-input"
                        :disabled="disabled || ! item.sparePartName"
                />
            </template>
            <template slot="asset" slot-scope="{item}">
                <input-label :required="item.sparePartName">所属设备：</input-label>
                <Select
                        v-model="item.assetId"
                        class="kld-select"
                        placeholder="请选择所属设备"
                        :disabled="disabled || ! item.sparePartName"
                >
                    <Option v-for="{id, assetName} in effectAssets" :value="id" :key="id">{{assetName}}</Option>
                </Select>
            </template>
            <template slot="num" slot-scope="{item}">
                <input-label :required="item.sparePartName">备件数量：</input-label>
                <kld-input-number
                        v-model="item.sparePartNum"
                        :precision="0"
                        :min="1"
                        number
                        placeholder="请输入数量"
                        :disabled="disabled || ! item.sparePartName"
                />
            </template>
        </increment-list>
        <select-asset-modal
                v-if="! disabled"
                :show.sync="modalShow"
                :value="assetsProxy"
                @input="assetsProxy = filterAssets($event)"
        />
    </div>
</template>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .contract-assets {
        .required{
            &::after{
                display: inline;
                content: '*';
                color: @color-error;
            }
        }
    }
</style>

<script>
    import IncrementList from './increment-list';
    import KldType from '@/common/kld-type';
    import KldInputNumber from '@/common/kld-input-number';

    const SelectAssetModal = () => import('./select-asset-modal');

    const InputLabel = {
        functional: true,
        props: {
            required: {
                // type: Boolean,
                default: false
            },
            tag: {
                type: String,
                default: 'p'
            }
        },
        render(h, ctx) {
            const {props: {tag, required}} = ctx;
            return h(tag, {
                class: {required, 'mb-10': true},
                // staticClass: 'mb-10',
            }, ctx.slots().default);
        }
    };

    export default {
        name: "contract-assets",
        components: {
            IncrementList,
            SelectAssetModal,
            KldType,
            KldInputNumber,

            InputLabel
        },
        props: {
            disabled: {
                type: Boolean,
                default: false
            },

            assets: {
                type: Array,
                default() {
                    return [];
                }
            },
            spareParts: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        data() {
            return {
                modalShow: false,
            };
        },

        computed: {
            assetColumns: () => [
                {
                    slot: 'name',
                    span: 7
                },
                {
                    slot: 'model',
                    span: 7
                },
                {
                    slot: 'brand',
                    span: 7
                },
                {
                    slot: 'date',
                    span: 3
                }
            ],
            defaultAssetData: () => ({
                assetId: '',
                hosId: '',
                departmentId: '',
                assetWarrntyDate: ''
            }),

            sparePartsColumns: () => [
                {
                    slot: 'name',
                    span: 7
                },
                {
                    slot: 'model',
                    span: 7
                },
                {
                    slot: 'asset',
                    span: 7
                },
                {
                    slot: 'num',
                    span: 3
                }
            ],
            defaultSparePartData: () => ({
                sparePartName: '',
                sparePartModel: '',
                assetId: '',
                sparePartNum: '',
            }),


            assetsProxy: {
                get() {
                    return this.assets;
                },

                set(assets) {
                    this.$emit('update:assets', assets);
                }
            },

            effectAssets() {
                return this.filterAssets(this.assetsProxy);
            },

            sparePartsProxy: {
                get() {
                    return this.spareParts;
                },
                set(spareParts) {
                    this.$emit('update:spareParts', spareParts);
                }
            }
        },

        methods: {
            filterAssets(assets) {
                return assets.filter(({id}) => id)
            },

            validate() {
                for (const asset of this.effectAssets) {
                    if (asset.id) {
                        if (! asset.assetWarrntyDate) {
                            this.$Message.warning('设备过保日期为必选');
                            return false;
                        }
                    }
                }

                for (const spare of this.sparePartsProxy) {
                    if (spare.sparePartName) {
                        if (! spare.sparePartModel) {
                            this.$Message.warning('备件型号为必填');
                            return false;
                        } else if (! spare.assetId) {
                            this.$Message.warning('备件所属设备为必选');
                            return false;
                        } else if (! spare.sparePartNum) {
                            this.$Message.warning('备件数量为必填');
                            return false;
                        }
                    }
                }

                return true;
            },
            getEffectAssets() {
                return this.effectAssets.map(
                    ({id, assetWarrntyDate, departmentId, hosId}) => ({
                        assetId: id,
                        assetWarrntyDate,
                        departmentId,
                        hosId
                    })
                );
            },
            getEffectSpareParts() {
                return this.sparePartsProxy.filter(({sparePartName}) => sparePartName);
            }
        }
    }
</script>