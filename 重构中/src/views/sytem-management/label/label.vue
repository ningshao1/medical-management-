<template>
    <!-- <div class="system-label">
        <div class="classify">
            <div class="title">
                标签分类
            </div>
            <ul>
                <li v-for="item in classify"
                    :key="item.key"
                    :class="{active:item.key===classifyId}"
                    @click="classifyId=item.key">{{item.name}}</li>
            </ul>
        </div>

        <div class="concreteness">
            <p class="title">资产标签</p>
            <kld-card title="自定义标签库"
                      class="label-card"
                      noHeadIcon>
                <div class="card-hint">每个标签的内容最多5个中文字符、10个英文字符。</div>
                <div class="labels">
                    <el-tag type="info"
                            class="card-tag"
                            v-for='item in customLabelData'
                            :key='item.id'
                            @close='delLabel(item.id)'
                            :closable='kldLimit("sys:label:del")'>{{item.labelName}}</el-tag>
                    <el-input class="input-new-tag card-tag"
                              v-if="inputVisible&&!loading"
                              v-model.trim="inputValue"
                              ref="saveTagInput"
                              size="small"
                              @keyup.enter.native="handleInputConfirm"
                              @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else-if='!loading'
                               class="button-new-tag card-tag"
                               size="small"
                               @click="showInput"
                               type="default">+ 添加标签</el-button>
                </div>
            </kld-card>
            <kld-card title="公共标签库"
                      class="label-card"
                      noHeadIcon>
                <div class="card-hint">公共标签库提供快捷标签，不可进行编辑，可直接使用。</div>
                <div class="labels">
                    <el-tag type="info"
                            class="card-tag"
                            v-for="item in commonLabelData"
                            :key='item.id'>
                        {{item.labelName}}
                    </el-tag>
                </div>
            </kld-card>
        </div>
    </div> -->
    <management-frame :listData='classify'
                      v-model="classifyId">
        <!-- <div slot="left">
            <ul>
                <li v-for="item in classify"
                    :key="item.key"
                    :class="{active:item.key===classifyId}"
                    @click="classifyId=item.key">{{item.name}}</li>
            </ul>
        </div> -->
        <div slot="right">
            <kld-card title="自定义标签库"
                      class="label-card"
                      noHeadIcon>
                <div class="card-hint">每个标签的内容最多5个中文字符、10个英文字符。</div>
                <div class="labels">
                    <el-tag type="info"
                            class="card-tag"
                            v-for='item in customLabelData'
                            :key='item.id'
                            @close='delLabel(item.id)'
                            :closable='kldLimit("sys:label:del")'>{{item.labelName}}</el-tag>
                    <el-input class="input-new-tag card-tag"
                              v-if="inputVisible&&!loading"
                              v-model.trim="inputValue"
                              ref="saveTagInput"
                              size="small"
                              @keyup.enter.native="handleInputConfirm"
                              @blur="handleInputConfirm">
                    </el-input>
                    <el-button v-else-if='!loading'
                               class="button-new-tag card-tag"
                               size="small"
                               @click="showInput"
                               type="default">+ 添加标签</el-button>
                </div>
            </kld-card>
            <kld-card title="公共标签库"
                      class="label-card"
                      noHeadIcon>
                <div class="card-hint">公共标签库提供快捷标签，不可进行编辑，可直接使用。</div>
                <div class="labels">
                    <el-tag type="info"
                            class="card-tag"
                            v-for="item in commonLabelData"
                            :key='item.id'>
                        {{item.labelName}}
                    </el-tag>
                </div>
            </kld-card>
        </div>
    </management-frame>
</template>

<script>
import kldCard from "@c/KldCard";
import { confirm } from "@el";
import kldFrame from "../components/management-frame";
export default {
    data() {
        return {
            classify: [
                {
                    name: "资产标签",
                    key: 1
                },
                {
                    name: "合同标签",
                    key: 3
                },
                {
                    name: "供应商标签",
                    key: 4
                },
                {
                    name: "报单标签",
                    key: 2
                }
            ],
            customLabelData: [],
            commonLabelData: [],
            classifyId: 1,
            inputVisible: false,
            inputValue: "",
            loading: false
        };
    },
    components: {
        [kldCard.name]: kldCard,
        [kldFrame.name]: kldFrame
    },
    computed: {
        osId() {
            return this.$store.state.userInfo.osId;
        }
    },
    watch: {
        classifyId: {
            immediate: true,
            handler() {
                this.getLabel();
                this.getCommonLabel();
            }
        }
    },
    created() {},
    methods: {
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            const length = this.getLength(this.inputValue);
            if (length > 10) {
                this.$message.warning("标签名最大长度为5个汉字或10个字母");
                return;
            }
            this.postLabel();
        },
        async getLabel() {
            this.loading = true;
            try {
                const { data } = await this.$axios.get(
                    `labelOrgstructs/${this.osId}/list?type=${this.classifyId}`
                );
                this.customLabelData = data;
            } finally {
                this.loading = false;
            }
        },
        async getCommonLabel() {
            const { data } = await this.$axios.get(
                "labels/list/" + this.classifyId
            );
            this.commonLabelData = data;
        },
        async postLabel() {
            if (this.inputValue !== "") {
                const { data } = await this.$axios.post("labelOrgstructs", {
                    osId: this.osId,
                    labelType: this.classifyId,
                    labelName: this.inputValue
                });
                this.customLabelData.push(data);
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
        delLabel(id) {
            confirm({
                title: "提示",
                content: "确定删除？",
                okText: "确定",
                cancelText: "取消",
                ok: async () => {
                    await this.$axios.delete(
                        `labelOrgstructs/${this.osId}/${id}`
                    );
                    const index = this.customLabelData.findIndex(
                        v => v.id === id
                    );
                    this.customLabelData.splice(index, 1);
                }
            });
        },
        getLength(str) {
            var realLength = 0,
                len = str.length,
                charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) realLength += 1;
                else realLength += 2;
            }
            return realLength;
        }
    }
};
</script>
<style scoped lang="scss">
@import "@/styles/var.scss";

/deep/.label-card {
    .head-title-content {
        font-size: 14px !important;
        color: rgba(0, 0, 0, 0.85) !important;
        font-weight: 600;
    }
}
.card-hint {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
}
.card-tag {
    border-radius: 0;
    margin: 3px;
}
.labels {
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
