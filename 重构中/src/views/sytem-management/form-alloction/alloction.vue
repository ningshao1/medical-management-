<template>
    <div>
        <management-frame class="alloction"
                          leftTitleName='工程师列表'
                          rightTitleName="分配科室"
                          search
                          v-model="userId"
                          :props="{
                          key:'id',
                          name:'name'
                      }"
                          :listData='engineerData'>
            <div slot="right"
                 class="os-tree">
                <kld-tree :data='data'
                          v-model="checkboxId"
                          :defaultExpandedKeys="checkedKey"
                          :props="defaultProps"
                          nodeKey="id"
                          show-checkbox
                          firstExpand
                          ref='kld-tree'
                          ></kld-tree>
            </div>

        </management-frame>
        <foot-btn @click="save"
                  :btnText="'提交'"
                  v-if='checkLimit("fr:add")'>
        </foot-btn>
    </div>
</template>

<script>
import kldFrame from "../components/management-frame";
import tree from "@c/KldTree";
import { deepClone } from "@u/index";
import footBtn from "../components/foot-btn";
export default {
    name: "fromAlloction",
    data() {
        return {
            engineerData: [],
            userId: "",
            checkboxId: [],
            data: [],
            originalData: [],
            defaultProps: {
                children: "lists",
                label: "osName"
            },
            checkedKey: []
        };
    },
    components: {
        [kldFrame.name]: kldFrame,
        [tree.name]: tree,
        [footBtn.name]: footBtn
    },
    computed: {},
    async created() {
        await this.getOsData();
        await this.getEngineerData();
    },
    methods: {
        async getEngineerData() {
            const { data } = await this.$axios.get(
                `orgstruct/getEngineers/${this.$store.state.userInfo.osId}`
            );
            this.engineerData = data;
            if (this.engineerData.length > 0)
                this.userId = this.engineerData[0].id;
        },
        async getOsData() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.originalData = [data];
            this.data = deepClone([data]);
        },
        async getselectedOs() {
            const { data } = await this.$axios.get(
                `engineerAllots/${this.userId}/engineerAllots`
            );
            this.checkedKey = data.map(v => {
                setTimeout(() => {
                    this.$refs["kld-tree"].$tree.setChecked(v.workGoupId, true);
                });
                return v.workGoupId;
            });
        },
        async save() {
            if (!this.checkLimit("fr:add")) {
                this.$message.warning("没有提交权限");
                return;
            }
            const checkId = this.$refs["kld-tree"].$tree.getCheckedNodes(
                false,
                true
            );
            const params = this.chooseParams(checkId);
            await this.$axios.post(`engineerAllots`, params);
            this.$message.success("提交成功");
        },
        chooseParams(data) {
            const params = [];
            if (!data instanceof Array) {
                return null;
            }
            data.map(v => {
                params.push({
                    workGoupId: v.id,
                    osId: this.$store.state.userInfo.osId,
                    engineerId: this.userId,
                    creatorId: this.$store.state.userInfo.osId
                });
            });
            return params;
        }
    },
    watch: {
        async userId(val) {
            await this.getselectedOs();
            this.data = deepClone(this.originalData); //树的数据初始化
        }
    }
};
</script>

<style scoped lang="less">
.os-tree {
    padding: 20px;
    max-height: calc(70vh - 56px);
    overflow-y: auto;
}
</style>
