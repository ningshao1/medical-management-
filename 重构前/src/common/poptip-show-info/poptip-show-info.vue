<template>
    <!-- <div v-if="isFormal" :style="poptipStyles" style="display: inline-block">
        <slot></slot>
    </div> -->
    <Tooltip v-model="poptipVisible" :placement="placement" transfer @on-popper-show.once="poptipShowHandler" ref="poptip" class="poptip-show-info" :style="poptipStyles" :delay="200">
        <div class='slot-name'>
            <slot></slot>
        </div>
        <div class="poptip-show-info-content" slot="content">
            <template v-if="poptipContentData.length > 0">
                <p v-for="data in poptipContentData">
                    <Icon v-if="data.icon" :type="data.icon"></Icon>
                    <span>{{data.label}}</span>
                    <span>{{data.value}}</span>
                </p>
            </template>
            <p v-else class="text-center">暂无信息</p>
            <!--<Loading v-if="poptipLoading"></Loading>-->
        </div>
    </Tooltip>
</template>

<style lang="less" scoped>
.text-center {
    text-align: center;
}
.poptip-show-info {
    /deep/.ivu-tooltip-rel {
        width: 100%;
    }
    .slot-name {
        color: #01b0c7;
    }
}

.poptip-show-info-content {
    text-align: left;
    color: #fff;
    font-size: 14px;
}
</style>

<script>
    import remoteAddress from "@common/Address";

    export default {
    name: "poptip-show-info",
    props: {
        infoId: { required: true },
        width: {
            type: [Number, String],
            default: "auto"
        }
    },
    data() {
        return {
            isFormal: remoteAddress === "http://47.97.191.60:8080/",

            poptipVisible: false,
            placement: "bottom",
            poptipLoading: false,
            poptipContentData: []
        };
    },
    computed: {
        poptipStyles() {
            const width = this.width;
            return {
                width: typeof width === "number" ? width + "px" : width
            };
        }
    },
    watch: {
        infoId() {
            this.resetPoptipShowHandler();
        }
    },
    methods: {
        resetPoptipShowHandler() {
            if (this.poptipVisible) {
                this.poptipShowHandler();
            } else if (this.$refs["poptip"]) {
                this.$refs["poptip"].$off("on-popper-show");
                this.$refs["poptip"].$once(
                    "on-popper-show",
                    this.poptipShowHandler
                );
            }
        },

        poptipShowHandler() {
            if (!(this.infoId instanceof Object) && this.infoId) {
                this.poptipLoading = true;
                this.getUserInfo()
                    .finally(() => {
                        this.poptipLoading = false;

                        //加载完数据之后更新poptip位置
                        this.$refs["poptip"].updatePopper();
                        // this.$nextTick(() => this.$refs['poptip'].updatePopper());
                    })
                    .catch(() =>
                        this.$refs["poptip"].$once(
                            "on-popper-show",
                            this.poptipShowHandler
                        )
                    );
            }
        },

        getUserInfo() {
            return this.$axios
                .get(`/users/getUserById/${this.infoId}`)
                .then(({ data }) => {
                    this.poptipContentData = data
                        ? [
                              {
                                  label: "姓名：",
                                  value: data.userName
                              },
                              {
                                  label: "科室：",
                                  value: data.osName
                              },
                              {
                                  label: "电话：",
                                  value: data.phone
                              },
                              {
                                  label: "角色：",
                                  value: data.roleName
                              }
                          ]
                        : [];
                });
        }
    }
};
</script>