<template>
    <div v-load='loading'>
        <management-frame class="alloction"
                          leftTitleName='医生列表'
                          rightTitleName="分配科室"
                          search
                          v-model="userId"
                          :props="{
                          key:'uId',
                          name:'uName'
                      }"
                          :listData='doctorData'>
            <div slot="right"
                 class="os-tree">
                <kld-tree :data='data'
                          v-model="checkboxId"
                          :defaultExpandedKeys="checkedKey"
                          :props="defaultProps"
                          nodeKey="id"
                          show-checkbox
                          firstExpand
                          ref='kld-tree'></kld-tree>
            </div>

        </management-frame>
        <foot-btn @click="save"
                  :btnText="'提交'">
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
            doctorData: [],
            userId: "",
            checkboxId: [],
            data: [],
            originalData: [],
            defaultProps: {
                children: "lists",
                label: "osName"
            },
            checkedKey: [],
            loading: false
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
        await this.getDoctorData();
    },
    methods: {
        async getDoctorData() {
            const { data } = await this.$axios.get(
                `doctorAllots/listDoctors?osId=${
                    this.$store.state.userInfo.osId
                }`
            );
            this.doctorData = data;
            if (this.doctorData.length > 0)
                this.userId = this.doctorData[0].uId;
        },
        async getOsData() {
            const data = await this.$store.dispatch("loadDepartmentTree");
            this.originalData = [data];
            this.data = deepClone([data]);
        },
        async getselectedOs() {
            const { data } = await this.$axios.get(
                `doctorAllots/doctorsOsIds?uId=${this.userId}`
            );
            this.checkedKey = data.map(v => {
                setTimeout(() => {
                    this.$refs["kld-tree"].$tree.setChecked(v, true);
                });
                return v;
            });
        },
        async save() {
            const checkId = this.$refs["kld-tree"].$tree.getCheckedKeys(
                false,
                true
            );
            this.loading = true;
            try {
                await this.$axios.post(`/doctorAllots/save`, {
                    userId: this.userId,
                    departmentIds: checkId,
                    hosId: this.$store.state.userInfo.osId
                });
                this.$message.success("提交成功");
            } finally {
                this.loading = false;
            }
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
