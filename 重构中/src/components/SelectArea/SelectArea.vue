<template>
    <el-cascader
            class="select-area"
            v-bind="$attrs"
            v-model="selected"
            :options="areaData"
            @active-item-change="activeItemChange"
    ></el-cascader>
</template>

<script>
    const PROVINCE_VALUES_NO_CHLIDREN = [
        710000,
        810000,
        820000
    ];

    const transformAreaData = data => {
            for (const item of data) {
                if (
                    !(PROVINCE_VALUES_NO_CHLIDREN.includes(item.value) || item.type === 3)
                ) {
                    item.children = [];
                }
            }
            return data;
        };

    export default {
        name: "select-area",
        props: {
            value: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        data() {
            return {
                areaData: [],
            };
        },

        computed: {
            selected: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                }
            }
        },

        watch: {
            selected: {
                immediate: true,
                async handler(selected) {
                    if (this.areaData.length === 0) {
                        await this.initAreaData();
                    }
                    for (let i = 0, len = selected.length; i < len; i++) {
                        await this.activeItemChange(selected.slice(0, i + 1));
                    }
                }
            }
        },

        methods: {
            async getAreaData(areaIds = []) {
                const {data} = await this.$axios.get(`/address/provinceList/${areaIds.join('/')}`);
                return transformAreaData(data);
            },
            findAreaData(areaIds = []) {
                let {areaData} = this;

                let result = null;

                for (const id of areaIds) {
                    const data = areaData.find(
                        area => area.value === id
                    );
                    if (data) {
                        areaData = data.children;
                        result = data;
                    } else {
                        return null;
                    }
                }
                return result;
            },
            async activeItemChange(areaIds) {
                const data = this.findAreaData(areaIds);
                if (data && Array.isArray(data.children) && data.children.length === 0) {
                    data.children = await this.getAreaData(areaIds);
                }
            },
            async initAreaData() {
                this.areaData = await this.getAreaData();
            }
        }
    }
</script>