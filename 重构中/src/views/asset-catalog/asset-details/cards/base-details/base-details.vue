<template>
    <div class="asset-base-details-wrap">
        <kld-card class="asset-basic-info-wrap">

            <kld-icon
                slot='title-prefix-icon'
                :styles="'width:24px;height:24px;'"
                :type='pageIcon'
            ></kld-icon>
            <div
                slot="title-text"
                class="ml-10"
                style="color:#4b74e0;font-size:20px;"
            >
                {{baseDetails.assetName}}
            </div>
            <div slot="head-icon">
                <template v-if="!loading&&baseDetails.id">

                    <el-button plain>打印标签</el-button>
                    <contract-btn v-model='baseDetails.contractId'></contract-btn>
                    <el-button plain>申请报废</el-button>
                    <el-dropdown
                        trigger="click"
                        class="ml-10"
                        @command='clickHandler'
                    >
                        <el-button
                            plain
                            style="width:28px;"
                        >···</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                divided
                                command='modify'
                            >编辑资产</el-dropdown-item>
                            <el-dropdown-item
                                divided
                                command='delete'
                            >删除资产</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </div>
            <div class="asset-basic-info">
                <div class="base-info-QR-code">
                    <img :src='QRCode' />
                </div>
                <el-row>
                    <el-col :span='8'>
                        <order-info
                            label='资产编码：'
                            :value='baseDetails.assetCode'
                        ></order-info>
                    </el-col>
                    <el-col :span='8'>
                        <order-info
                            label='品牌名称：'
                            :value='baseDetails.brandName'
                        ></order-info>

                    </el-col>
                    <el-col :span='8'>
                        <order-info
                            label='资产型号：'
                            :value='baseDetails.assetClass'
                        ></order-info>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <order-info
                            label='现有编码：'
                            :value='baseDetails.oldAssetCode'
                        ></order-info>

                    </el-col>
                    <el-col :span='8'>
                        <order-info
                            label='序列号：'
                            :value='baseDetails.assetSN'
                        ></order-info>

                    </el-col>
                    <el-col :span='8'>
                        <order-info
                            label='设备注册证号：'
                            :value='baseDetails.registration'
                        ></order-info>

                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span='24'>

                        <order-info
                            label='国家分类：'
                            :value='typeName'
                        ></order-info>
                    </el-col>
                    <el-col
                        :span='24'
                        v-if="labels.length"
                        class="mt-5"
                    >
                        <template v-for="(v,i) of labels">
                            <el-tag
                                :key='i'
                                type='info'
                                class="mr-15"
                            >
                                {{v.labelName}}
                            </el-tag>
                        </template>
                    </el-col>

                </el-row>

            </div>

        </kld-card>
        <div class="full-width mt-10 flex">
            <kld-card
                title='使用信息'
                no-head-icon
                class="flex-grow-lazy-1"
            >
                <div class="full-width pb-10">

                    <el-row>
                        <el-col :span='8'>
                            <order-info
                                label='所属科室：'
                                :value='baseDetails.osName'
                            ></order-info>
                        </el-col>
                        <el-col :span='8'>
                            <order-info
                                label='安装时间：'
                                :value='baseDetails.collarTime'
                            ></order-info>

                        </el-col>
                        <el-col :span='8'>
                            <order-info
                                label='使用年限：'
                                :value='baseDetails.durableYears'
                            ></order-info>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span='8'>
                            <order-info
                                label='安装地点：'
                                :value='baseDetails.installSectionName'
                            ></order-info>

                        </el-col>
                        <el-col :span='8'>
                            <order-info
                                label='管理人：'
                                :value='baseDetails.userName'
                            ></order-info>

                        </el-col>
                        <el-col :span='8'>
                            <order-info
                                label='负责人：'
                                :value='baseDetails.responsibleName'
                            ></order-info>

                        </el-col>
                        <el-col :span='8'>
                            <order-info
                                label='使用时间(月)：'
                                :value='baseDetails.useMonth'
                            ></order-info>

                        </el-col>
                    </el-row>
                </div>
                <div class="full-width pt-10">
                    <image-view
                        :image-list='photos'
                        :bordered='false'
                        class="p-0"
                    ></image-view>
                </div>

            </kld-card>
            <div class="description-card">
                <function-description-card></function-description-card>
            </div>
        </div>
    </div>
</template>
<script>
import { Common } from "@/mixins";
import KldIcon from "@c/KldIcon";
import mixin from "../../mixin.js";
import OrderInfo from "@c/OrderInfo";
import { FunctionDescriptionCard } from "../components";
import ImageView from "@c/ImageView";
import ContractBtn from "./contract-btn.vue";
export default {
    name: "asset-base-details",
    mixins: [Common, mixin],
    components: {
        KldIcon,
        OrderInfo,
        FunctionDescriptionCard,
        ImageView,
        ContractBtn
    },
    props: {},
    data() {
        return {
            baseDetails: {},
            loading: false
        };
    },
    computed: {
        pageIcon() {
            return this.$route.meta.icon;
        },
        photos() {
            return (this.baseDetails.photos || []).filter(photo => photo);
        },
        labels() {
            return (this.baseDetails.labels || []).filter(label => label);
        },
        QRCode() {
            let qrCode = this.baseDetails.qrCode;
            return qrCode ? `data:image/png;base64,${qrCode}` : "";
        },
        typeName(){
            return (this.baseDetails.typeParents||[]).toString();
        }
    },
    created() {
        this.remoteBaseDetails();
    },
    methods: {
        async remoteBaseDetails() {
            this.loading = true;
            try {
                const { data } = await this.$axios.get(
                    `assets/${this.osId}/${this.id}`
                );
                this.baseDetails = data;
            } finally {
                this.loading = false;
            }
        },
        clickHandler(command) {
            this[command]();
        },
        modify() {
            this.$router.push({
                name: "asset-modify",
                params: {
                    id: this.id
                }
            });
        },
        delete() {
            this.$silentConfirm({
                content: "是否确定删除该资产？",
                ok: async () => {
                    await this.$axios.delete(`/assets/${this.osId}/${this.id}`);
                    this.$router.go(-1);
                    this.$nextTick(() => {
                        this.$message.success("成功删除资产。");
                    });
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.asset-base-details-wrap {
    .asset-basic-info-wrap {
        .asset-basic-info {
            position: relative;
            padding-right: 15vw;
            .base-info-QR-code {
                position: absolute;
                top: 0;
                right: 0;
            }
        }
    }
    /deep/.order-info-wrap {
        margin: 8px 0;
        .order-info-label {
            color: rgba(0, 0, 0, 0.85);
        }
        .order-info-value {
            color: rgba(0, 0, 0, 0.65);
        }
    }
    .description-card {
        width: 15vw;
    }
}
</style>