<style lang="less" scoped>
    .increment-list {
        .list{
            .list-item{
                margin-bottom: 10px;
                display: flex;
                &:last-of-type{
                    margin-bottom: 0;
                }

                >a{
                    flex-shrink: 0;
                    margin-top: 38px;
                }
                .ivu-row{
                    flex-grow: 1;
                }
            }
        }

        .add-btn{
            height: 44px;
            border: none;
            background-color: #f5f6fa;
            cursor: pointer;
        }
    }
</style>

<script type="text/jsx">
    import {Button, Row, Col} from 'iview';
    import kldConfirm from '@common/kld-confirm';

    const copy = obj => JSON.parse(JSON.stringify(obj));
    export default {
        name: "increment-list",
        props: {
            defaultItemData: {
                type: Object,
                default() {
                    return {};
                }
            },
            items: {
                type: Array,
                default() {
                    return [];
                }
            },
            columns: {
                type: Array,
                default() {
                    return [];
                }
            },
            rowKey: {
                type: [String, Symbol],
                default: 'id'
            },
            editable: {
                type: Boolean,
                default: true
            }
        },

        computed: {
            itemsProxy: {
                get() {
                    return this.items;
                },
                set(v) {
                    this.$emit('update:items', v);
                }
            }
        },

        watch: {
            itemsProxy: {
                immediate: true,
                handler(items) {
                    if (items.length === 0 && this.editable) {
                        this.itemsProxy = [copy(this.defaultItemData)];
                    }
                }
            }
        },

        render(h) {
            return (
                <div class="increment-list">
                    <div class="list">
                        {
                            this.items.map(
                                (item, index) => (
                                    <div class="list-item" key={item[this.rowKey] || index}>
                                        <Row gutter={10}>
                                            {
                                                this.columns.map(
                                                    ({slot, render, span, ...styles}, index) => {
                                                        const data = {item, index};
                                                        return (
                                                            <Col span={span} style={styles}>
                                                                {slot ? this.$scopedSlots[slot](data) : render(h, data)}
                                                            </Col>
                                                        );
                                                    }
                                                )
                                            }
                                        </Row>
                                        {
                                            this.editable ?
                                                <a class="ml-20" onClick={() => this.delItem(index)} href="javascript:">删除</a>
                                                :
                                                null
                                        }
                                    </div>
                                )
                            )
                        }
                    </div>
                    {
                        this.editable ?
                            <button onClick={this.addItem} class="add-btn full-width kld-success mt-20" type="button">+添加</button>
                            :
                            null
                    }
                </div>
            );
        },

        methods: {
            addItem() {
                this.itemsProxy = [...this.itemsProxy, copy(this.defaultItemData)];
            },
            delItem(index) {
                kldConfirm({
                    content: '是否要是删除当前行数据',
                    ok: () => {
                        if (this.itemsProxy.length === 1) {
                            this.itemsProxy = [copy(this.defaultItemData)];
                        } else {
                            const newValue = [...this.items];
                            newValue.splice(index, 1);
                            this.itemsProxy = newValue;
                        }
                    }
                })
            }
        }
    }
</script>