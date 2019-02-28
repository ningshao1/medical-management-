<script type="text/jsx">
    import KldBox from '../../common/kld-box';
    import InfoItem from './info-item';
    import {Row, Col} from 'iview';
    export default {
        name: "asset-base-info",
        // functional: true,
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        render(h, ctx) {
            //使用嵌套的函数式组件时 scoped样式会有问题 vue@2.5.21
            // const {props: {data}} = ctx;
            const {data} = this;
            return (
                <KldBox>
                    <template slot="title">设备信息</template>
                    <div class="asset-base-info">
                        <div class="title">
                            <p class="fz-16 kld-success text-ellipsis">设备名称：{data.assetName}</p>
                            {
                                [
                                    <div class="tag">未报修</div>,
                                    <div class="tag error">已报修</div>
                                ][data.frStatus]
                            }
                        </div>
                        <div class="content">
                            <Row class="mt-10">
                                <Col span="12">
                                    <InfoItem label="设备编码：" content={data.assetCode} ellipsis={false}/>
                                </Col>
                                <Col span="12">
                                    <InfoItem label="所属科室：" content={data.departmentName}/>
                                </Col>
                            </Row>
                            <Row class="mt-10">
                                <Col span="12">
                                    <InfoItem label="设备品牌：" content={data.brandName}/>
                                </Col>
                                <Col span="12">
                                    <InfoItem label="设备型号：" content={data.assetClass}/>
                                </Col>
                            </Row>
                            <Row class="mt-10">
                                <Col span="24">
                                    <InfoItem label="设备分类：" content={data.typeName}/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </KldBox>
            );
        }
    }
</script>

<style lang="less" scoped>
    @import "~@inspection-common/varible";
    .asset-base-info {
        .title{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .tag{
            padding: 2px 6px;
            font-size: 12px;
            border-radius: 3px;
            color: #fff;
            background-color: @color-default;
            &.error{
                background-color: @color-error;
            }
        }
    }
</style>