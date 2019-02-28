<template>
    <div class="change-remote-address">
        <Row class="content" type="flex" justify="center" align="middle">
            <i-col :xs="18" :sm="6">
                <Card>
                    <p slot="title">修改远程服务器地址</p>
                    <a slot="extra" @click="$router.back()" href="javascript:">返回</a>
                    <Form :model="formData" ref="form" :label-width="60" @keyup.enter.native="setBaseURL">
                        <FormItem label="主机名：" prop="hostname">
                            <i-input v-model="formData.hostname"></i-input>
                        </FormItem>
                        <FormItem label="端口：" prop="port">
                            <i-input v-model="formData.port"></i-input>
                        </FormItem>
                    </Form>
                    <Row class="btn-wrap" type="flex" justify="end">
                        <Button @click="resetForm" class="kld-btn-small kld-btn-default">重置</Button>
                        <Button @click="setBaseURL" class="kld-btn-small">确认</Button>
                    </Row>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<style lang="less" scoped>
    .change-remote-address {
        .content{
            height: 100vh;
        }
        .ivu-form-item{
            margin-bottom: 24px !important;
        }
        .btn-wrap{
            .ivu-btn{
                margin-left: 10px;
            }
        }
    }
</style>

<script>
    export default {
        name: "change-remote-address",

        data() {
            const oldURL = this.$axios.defaults.baseURL,
                {hostname, port} = new URL(oldURL);

            return {
                oldURL,
                formData: {
                    hostname,
                    port
                }
            }
        },

        computed: {
            newURL() {
                const {
                    formData: {hostname, port},
                    oldURL
                } = this;

                const urlObj = new URL(oldURL);

                urlObj.hostname = hostname;
                urlObj.port = port;

                return urlObj.href;
            }
        },

        methods: {
            setBaseURL() {
                const {newURL, oldURL} = this;

                if (newURL !== oldURL) {
                    this.$axios.defaults.baseURL =
                    this.axios.defaults.baseURL =
                    this.oldURL =
                        newURL;

                    this.$Message.success('设置成功，刷新页面后失效');
                }
            },
            resetForm() {
                this.$refs['form'].resetFields();
            }
        }
    }
</script>