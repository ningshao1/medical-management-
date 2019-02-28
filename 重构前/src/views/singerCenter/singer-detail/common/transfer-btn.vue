<template>
    <i-button class='kld-btn'
              @click="show=true">
        <template>

            转交
        </template>
        <Modal v-model="show"
               title="转交报单"
               class-name="transfer-singer-modal"
               :styles="{
                   top:'50px'
               }"
               width="350px">
            <div class="transfer-singer-wrap">
                <i-input icon="ios-search"
                         style="width:100%"
                         placeholder="请输入关键字"
                         v-model="engineerName"
                         @on-change="searchChange"></i-input>
                <RadioGroup v-model="transferor.id"
                            style="width:100%">
                    <h3>可转交人员列表</h3>
                    <ul class="transfer-list">
                        <li v-for="item in engineerList"
                            :key="item.id"
                            @click="selectTransfer(item)"
                            :class="{'transfer-checked':item.id===transferor.id}">
                            {{item.name}}
                            <Radio :label="item.id"
                                   style="width:10px;">
                                <span></span>
                            </Radio>
                        </li>
                        <li class="no-data"
                            v-if="!engineerList.length&&!loading">
                            暂无
                        </li>
                        <li is="kld-loading"
                            v-if="loading"></li>
                    </ul>
                </RadioGroup>
            </div>
            <div slot="footer">
                <Button class="kld-btn-default"
                        @click="show=false">取消</Button>
                <Button class="kld-btn"
                        :loading="btnLoading"
                        @click="checkTransfer">确认</Button>
            </div>
        </Modal>
    </i-button>
</template>

<script>
import kldLoading from "@common/loading/loading.vue";
import kldConfirm from "@common/kld-confirm/index.js";
export default {
    name: "transfer-btn",
    components: { kldLoading },
    data() {
        return {
            show: false,
            engineerName: "",
            engineerList: [],
            transferor: {},
            loading: false,
            btnLoading: false,
            timer: null
        };
    },
    props: {
        singerInfo: Object
    },
    computed: {
        singerId() {
            return this.$route.query.id;
        },
        userInfo() {
            return this.$store.state.user_in;
        }
    },
    created() {
        this.loadEngineerList();
    },

    methods: {
        async loadEngineerList(name) {
            this.loading = true;
            try {
                let getBody = name ? `?name=${name}` : "";
                let url = `/orgstruct/getEngineers/${
                    this.userInfo.osId
                }${getBody}`;
                const { data } = await this.$axios.get(url);
                this.engineerList = data || [];
            } finally {
                this.loading = false;
            }
        },
        searchChange(e) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                const {
                    target: { value }
                } = e;
                let name = value.trim();
                this.loadEngineerList(name);
            }, 500);
        },
        selectTransfer({ id, name }) {
            this.transferor = {
                id,
                name
            };
        },
        checkTransfer() {
            if (!this.transferor.id) {
                return this.$Message.warning("请先选择转交人！");
            }
            kldConfirm({
                title: "提示",
                content: `是否确定将此报单自 ${
                    this.singerInfo.userName
                } 转交至 ${this.transferor.name}?`,
                maskClosable: false, //是否允许点击遮罩关闭 默认:false
                ok: () => {
                    //当点击了确认按钮时
                    this.transfer();
                }
            });
        },
        async transfer() {
            this.btnLoading = true;
            try {
                await this.$axios.put(
                    `/faultReport/appointFaultReport?id=${
                        this.singerId
                    }&&userID=${this.transferor.id}&&userName=${
                        this.transferor.name
                    }`
                );
                // let postBody = {
                //     userId: this.transferor.name
                // };
                // await this.$axios.post(
                //     `activiti/complete/${this.singerInfo.taskId}/${
                //         this.singerId
                //     }`,
                //     postBody
                // );
                this.$Message.success(
                    `报单已成功转交给工程师：${this.transferor.name}`
                );
                this.$router.go(-1);
            } finally {
                this.btnLoading = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
/deep/.transfer-singer-modal {
    .transfer-singer-wrap {
        h3 {
            width: 100%;
            text-align: center;
            padding: 10px;
        }
        .transfer-list {
            height: 500px;
            overflow: auto;
            width: 100%;
            position: relative;
            > li {
                border: 1px solid #dddee1;
                position: relative;
                cursor: pointer;
                display: flex;
                width: 100%;
                height: 40px;
                justify-content: space-between;
                padding: 0 50px;
                align-items: center;
                border-radius: 4px;
                margin-bottom: 5px;
                font-size: 14px;
            }
            .transfer-checked {
                border: 1px solid #2d8cf0;
                color: #2d8cf0;
            }
            .no-data {
                justify-content: center;
                user-select: none;
            }
        }
    }
}
</style>




