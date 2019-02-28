<template>
    <div class="element-check">
        <div class="quickly-add-left">
            <div class="quickly-title">
                <span>{{labels[0]}}</span>
            </div>
            <div class="quickly-content">
                <ul class="item-lists">
                    <li
                            class="single-item"
                            :class="{'single-item-active': currentType.id === type.id}"
                            v-for='type of typeData'
                            :key='type.id'
                            @click="typeClick(type)"
                    >
                        <Checkbox @on-change="checkChange(type)" v-model="type._checked" @click.native.stop><div></div></Checkbox>
                        <span class="checkbox-span textEllipsis">{{type.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="quickly-add-left">
            <div class="quickly-title">
                <span>{{labels[1]}}</span>
            </div>
            <div class="quickly-content">
                <ul class="item-lists" >
                    <li
                            class="single-item"
                            :class="{'single-item-active': currentItem.id === item.id}"
                            v-for="item in currentType.children"
                            :key='item.id'
                            @click="itemClick(item)"
                    >
                        <Checkbox @on-change="checkChange(item)" v-model="item._checked" @click.native.stop>
                            <div></div>
                        </Checkbox>
                        <span class="checkbox-span textEllipsis">{{item.lName}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="quickly-add-right">
            <div class="quickly-title">
                <span>{{labels[2]}}</span>
            </div>
            <div class="quickly-content">
                <ul class="element-lists">
                    <li class="single-element" v-for="(element, index) of currentItem.children" :key='element.id'>
                        <Checkbox @on-change="checkChange(element)" v-model="element._checked" :label="element.id">
                            <div></div>
                        </Checkbox>
                        <span class="checkbox-span textEllipsis">{{index + 1}}、{{element.eContent}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <Loading v-if="loading"></Loading>
    </div>
</template>

<style lang="less" scoped>
    .element-check {
        @border: 1px solid rgba(2, 31, 57, 0.1);
        position: relative;
        width: 100%;
        height: 400px;
        border: @border;
        border-radius: 4px;
        display: flex;
        margin-top: 10px;
        .quickly-add-wrap {
            //通用样式
            height: 100%;
        }
        .quickly-title-same {
            padding: 0 20px;
            height: 40px;
            line-height: 40px;
            border-bottom: @border;
            font-weight: 550;
            background-color: #eeeeee;
        }
        .quickly-content-same {
            width: 100%;
            height: calc(~"100% - 40px");
            overflow: auto;
        }
        .ul-lists {
            width: 100%;
            li {
                padding-left: 8px;
                height: 40px;
                display: flex;
                align-items: center;
                border-bottom: @border;
                border-left: 4px solid transparent;
                cursor: pointer;
                &:hover {
                    background-color: #fbfbfb;
                }
                .checkbox-span {
                    font-size: 14px;
                    padding-left: 10px;
                    width: 100%;
                }
            }
        }
        .quickly-add-left {
            .quickly-add-wrap;
            border-right: @border;
            width: 30%;
            .quickly-title {
                .quickly-title-same;
            }
            .quickly-content {
                .quickly-content-same;
                .item-lists {
                    .ul-lists;
                    .single-item-active {
                        background-color: #fafafa;
                        border-left-color: #0c8399
                    }
                }

            }
        }
        .quickly-add-right {
            .quickly-add-wrap;
            width: 40%;
            .quickly-title {
                .quickly-title-same;
            }
            .quickly-content {
                .quickly-content-same;
                .element-lists {
                    .ul-lists;
                }
            }
        }
    }
</style>

<script>
    export default {
        name: "element-check",
        props: {
            type: {
                type: String,
                default: 'inspect'
            },
        },
        data() {
            return {
                typeData: [],

                currentType: {},
                currentItem: {},

                loading: false
            };
        },

        computed: {
            isInspect() {
                return this.$route.name === 'inspection-element';
            },

            labels() {
                const type = this.isInspect ? '巡检' : '保养';

                return ['类别', '项', '要素'].map(s => type + s);
            },

            requestPrefix() {
                return this.isInspect ? 'inspectionOption' : 'maintenanceOption';
            },

            hospitalId() {
                return this.$store.state.user_in.osId;
            }
        },

        watch: {
            typeData(data, oldData) {
                if (data !== oldData) {
                    this.currentType = data.length > 0 ? data[0] : {};
                }
            },
            currentType(type, oldType) {
                if (type !== oldType) {
                    this.currentItem = type.children && type.children.length > 0 ? type.children[0] : {};
                }
            }
        },

        created() {
            this.updateData();
        },

        methods: {
            typeClick(type) {
                this.currentType = type;
            },

            itemClick(item) {
                this.currentItem = item;
            },

            checkChange({parent, children, _checked: value}) {
                this.setParentCheck(parent);

                this.setChildrenCheck(children, value);
            },

            setChildrenCheck(children, value) {
                if (children) {
                    for (const child of children) {
                        this.$set(child, '_checked', value);
                        if (child.children) {
                            this.setChildrenCheck(child.children, value);
                        }
                    }
                }
            },

            setParentCheck(parent) {
                while (parent) {
                    this.$set(parent, '_checked', parent.children.some(
                        ({_checked}) => _checked
                    ));

                    parent = parent.parent;
                }
            },

            getChecked(typeId, selfType) {
                const result = [];

                for (const type of this.typeData) {
                    if (type._checked) {
                        for (const item of type.children) {
                            if (item._checked) {
                                result.push({
                                    id: item.id,
                                    lName: item.lName,
                                    optionId: typeId,
                                    selfType,
                                    pmElements: item.children.filter(({_checked}) => _checked)
                                        .map(
                                            element => ({
                                                id: element.id,
                                                eContent: element.eContent,
                                                selfType,
                                                lId: item.id
                                            })
                                        )
                                });
                            }
                        }
                    }
                }

                return result;
            },

            clearChecked(data = this.typeData) {
                for (const item of data) {
                    if (data.children) {
                        this.clearChecked(item.children);
                    }

                    this.$set(item, '_checked', false);
                }
            },

            async updateData() {
                this.loading = true;
                try {
                    const typeData = await this.getTypeData();

                    await Promise.all(typeData.map(
                        async type => {
                            const items = type.children = await this.getItemData(type.id);

                            await Promise.all(items.map(
                                async item => {
                                    item.parent = type;

                                    (item.children = await this.getElementData(item.id))
                                        .forEach(i => i.parent = item);
                                }
                            ));
                        }
                    ));

                    this.typeData = typeData;

                } finally {
                    this.loading = false;
                }
            },

            async getTypeData() {
                const {data} = await this.$axios.post(`/${this.requestPrefix}/elementOption/${this.hospitalId}/list`, {
                    offset: 0,
                    limit: Number.MAX_SAFE_INTEGER,
                    params: {}
                });

                return data.filter(({selfType}) => selfType === 1);
            },

            async getItemData(typeId) {
                const {data} = await this.$axios.post(`/${this.requestPrefix}/elementType/${typeId}/list`, {
                    offset: 0,
                    limit: Number.MAX_SAFE_INTEGER,
                    params: {}
                });

                return data;
            },

            async getElementData(itemId) {
                const {data} = await this.$axios.post(`/${this.requestPrefix}/element/${itemId}/list`, {
                    offset: 0,
                    limit: Number.MAX_SAFE_INTEGER,
                    params: {}
                });

                return data;
            }
        }
    }
</script>