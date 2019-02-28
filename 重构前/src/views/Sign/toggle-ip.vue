<template>
    <a @click.prevent="showModel">切换IP
        <Modal v-model="modalShow"
               class-name="toggle-ip-modal"
               @on-ok='toggleIP'
               title="切换IP">
            <Form ref="toggle-ip-form"
                  :model="urlMap">
                <i-row>
                    <i-col :span="24">
                        <FormItem label="host"
                                  prop='hostname'>
                            <i-input v-model='urlMap.hostname'></i-input>
                        </FormItem>

                    </i-col>
                    <i-col :span="24">
                        <FormItem label="port"
                                  prop='port'>
                            <i-input v-model='urlMap.port'></i-input>
                        </FormItem>
                    </i-col>
                </i-row>
            </Form>

        </Modal>
    </a>

</template>
<script>
import currentUrl from "@common/Address/index";
export default {
    name: "toggle-ip",
    data() {
        const { hostname, port } = new URL(currentUrl);
        return {
            modalShow: false,
            currentUrl:currentUrl,
            urlMap: {
                hostname,
                port
            }
        };
    },
    computed: {
        newUrl: {
            get(){

                const {hostname,port}=this.urlMap;
                let newUrl=new URL(this.currentUrl);
                newUrl.hostname=hostname;
                newUrl.port=port;
                return newUrl.href;
            }
        }
    },
    methods: {
        showModel() {
            this.$refs["toggle-ip-form"].resetFields();
            this.modalShow = true;
        },
        toggleIP() {
            window.localStorage.setItem('java-addresses',this.newUrl);
            window.location.reload();
        }
    }
};
</script>
<style lang="less" scoped>
.toggle-ip-modal {
}
</style>

