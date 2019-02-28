<template>
    <div v-load='loading'>
        <kld-card noheader>
            <el-row :gutter='20'>
                <el-form :model="form"
                         :rules="formRule"
                         ref="form">
                    <el-col :span="12">
                        <el-form-item label="医院名称"
                                      prop="osName">
                            <el-input v-model="form.osName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医院简称"
                                      prop='osShortname'>
                            <el-input v-model="form.osShortname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人"
                                      prop='osContact'>
                            <el-input v-model="form.osContact"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式"
                                      prop='osPhone'>
                            <el-input v-model="form.osPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医院地址">
                            <el-cascader :options="options"
                                         v-model="form.adressId"
                                         @active-item-change="handleItemChange"
                                         :change-on-selec='false'>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="osAddress"
                                      label="地址详情">
                            <el-input v-model="form.osAddress"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </kld-card>
        <foot-btn @click="save"></foot-btn>
    </div>
</template>

<script>
import kldCard from "@c/KldCard";
import footBtn from "../components/foot-btn";
export default {
    data() {
        return {
            form: {
                adressId: [],
                osName: "",
                osPhone: "",
                osContact: "",
                osShortname: "",
                osAddress: "",
                osParentid: "",
                id: this.$store.state.userInfo.osId
            },
            formRule: {
                osName: [
                    {
                        required: true,
                        message: "请输入医院名称",
                        trigger: "blur"
                    }
                ],
                osContact: [
                    {
                        required: true,
                        message: "请输入联系人",
                        trigger: "blur"
                    }
                ],
                osPhone: [
                    {
                        required: true,
                        message: "请输入联系方式",
                        trigger: "blur"
                    },
                    {
                        validator(rule, val, callback) {
                            if (/^\d+[-]?\d+$/.test(val)) {
                                callback();
                            } else {
                                callback(new Error("请输入正确的联系方式"));
                            }
                        }
                    }
                ]
            },
            options: [],
            loading: false
        };
    },
    components: {
        [kldCard.name]: kldCard,
        [footBtn.name]: footBtn
    },
    async created() {
        await this.getData();
        await this.getProvince();
        await this.getCity(this.form.adressId[0]);
        await this.county(this.form.adressId[0], this.form.adressId[1]);
    },
    methods: {
        async getProvince() {
            const { data } = await this.$axios.get(`address/provinceList`);
            const province = [];
            data.map(v => province.push({ ...v, children: [] }));
            this.options = province;
            return data;
        },
        async getCity(value) {
            const { data } = await this.$axios.get(
                `address/provinceList/${value}`
            );
            const item = this.options.find(v => v.value == value);
            if (!item) return;
            item.children = data.map(v => {
                return {
                    ...v,
                    children: []
                };
            });
        },
        async county(Province, city) {
            const { data } = await this.$axios.get(
                `address/provinceList/${Province}/${city}`
            );
            const itemIndex = this.options.findIndex(v => v.value == Province);
            const cityData = this.options[itemIndex].children;
            console.log(cityData);
            const item = cityData.find(v => v.value == city);
            item.children = data;
        },
        handleItemChange(data) {
            if (data.length === 1) {
                this.getCity(data[0]);
            } else if (data.length === 2) {
                this.county(data[0], data[1]);
            }
        },
        async getData() {
            this.loading = true;
            try {
                const { data } = await this.$axios.get(
                    `/orgstruct/query/${this.$store.state.userInfo.osId}`
                );
                for (const key in this.form) {
                    this.form[key] = data[key];
                }
                this.form.adressId = [
                    data.provinceid,
                    data.cityid,
                    data.areaid
                ];
                return data;
            } finally {
                this.loading = false;
            }
        },
        async save() {
            this.loading = true;
            try {
                await this.$axios.put(`/orgstruct/updatehospital`, {
                    ...this.form,
                    provinceid: this.form.adressId[0] + "",
                    cityid: this.form.adressId[1] + "",
                    areaid: this.form.adressId[2] + ""
                });
                this.$message.success("保存成功");
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped lang="less">
</style>
