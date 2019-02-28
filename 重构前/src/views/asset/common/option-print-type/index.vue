<template>
    <div>
        <Modal v-model="typeShow"
               title="选择打印类型"
               width='800'>
            <p class="type-title">点击选择打印样式：</p>
            <Row class="print-type"
                 :gutter="16">
                <Col span="6">
                <div class="img-border"
                     :class='type===1?"active":""'
                     @click="type=1">
                    <p class="qr-title">尺寸：40MM*30MM</p>
                    <img class="small"
                         :src="require('../../image/small-QR.png')"
                         alt="" />
                    <div class='qr-description'></div>
                </div>
                </Col>

                <Col span="8">
                <div class="img-border"
                     :class='type===2?"active":""'
                     @click="type=2">
                    <p class="qr-title">尺寸：60MM*40MM</p>
                    <img class="middle"
                         :src="require('../../image/middle-QR.png')"
                         alt="" />

                    <div class='qr-description'></div>
                </div>
                </Col>

                <Col span="10">
                <div class="img-border"
                     :class='type===3?"active":""'
                     @click="type=3">
                    <p class="qr-title">尺寸：100MM*80MM</p>
                    <img class="big"
                         :src="require('../../image/big-QR.png')"
                         alt="" />
                </div>
                </Col>

            </Row>
            <div slot="footer"
                 class="modal-foot">
                <span>确定前请检查打印纸尺寸</span>
                <div>
                    <Button type='text'
                            @click="typeShow=false">
                        取消
                    </Button>
                    <Button class="kld-btn"
                            @click="confirm">
                        确定
                    </Button>
                </div>
            </div>
        </Modal>
        <asset-list-choose ref='list-choose'
                           :type='type'
                           :printTypeShow.sync='typeShow'>
        </asset-list-choose>
    </div>
</template>
<script>
import choose from "./asset-list-choose";
export default {
    name: "print-type",
    props: {
        JumpID: {
            type: String
        }
    },
    data() {
        return {
            typeShow: false,
            type: 0
        };
    },
    components: {
        [choose.name]: choose
    },

    methods: {
        confirm() {
            if (!this.type) {
                this.$Message.warning("请选择二维码样式");
                return;
            }
            if (this.JumpID) {
                this.$router.push({
                    name: "print-new-QR",
                    query: {
                        type: this.type + "",
                        assetIds: [this.JumpID]
                    }
                });
            } else {
                this.typeShow = false;
                this.$refs["list-choose"].typeShow = true;
            }
        }
    },
    created() {}
};
</script>
<style lang="less" scoped>
.type-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}
.print-type {
    .small,
    .middle,
    .big {
        width: 100%;
    }
    .qr-title {
        text-align: center;
        margin-bottom: 8px;
        font-size: 14px;
    }
    .qr-description {
    }

    .img-border {
        padding: 8px;
        box-sizing: border-box;
        border-radius: 3px;
        border: 2px solid #fff;
        cursor: pointer;
        &:hover {
            border: 2px solid #409eff;
            box-sizing: border-box;
        }
    }
    .active {
        border: 2px solid #409eff;
    }
}
.modal-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
        color: #ed3f14;
        font-size: 14px;
    }
}
</style>
