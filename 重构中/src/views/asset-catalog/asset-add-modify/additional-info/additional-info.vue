<template>
    <div class="additional-info-wrap">
        <kld-card noheader>
            <el-row>
                <el-col>
                    <el-form-item
                        prop="used"
                        label="设备状态"
                    >
                        <el-radio-group v-model="cardItems.used">
                            <el-radio
                                v-for="{label,text} in usedTypes"
                                :key="label"
                                :label="label"
                            >{{text}}</el-radio>
                        </el-radio-group>

                    </el-form-item>

                </el-col>
                <el-col>
                    <el-form-item
                        prop="labelIds"
                        label="设备标签"
                    >
                        <el-select
                            v-model="cardItems.labelIds"
                            multiple
                            :multiple-limit='5'
                        >
                            <template v-for="(item,i) of labels">
                                <el-option
                                    :key='i'
                                    :label="item.labelName"
                                    :value="item.id"
                                ></el-option>
                            </template>
                        </el-select>

                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item
                        label="设备图片"
                        prop="photos"
                    >
                        <div class="full-width inline-block">
                            <kld-upload v-model="cardItems.photos"></kld-upload>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col>

                </el-col>
            </el-row>
        </kld-card>

    </div>
</template>
<script>
import KldUpload from "@c/kld-upload/index.vue";
import mixin from "../mixin.js";
export default {
    name: "additional-info",
    mixins: [mixin],
    components: { KldUpload },
    props: {},
    data() {
        return {
            used: {
                types: [
                    {
                        label: 1,
                        text: "在用",
                        type: "noraml"
                    },
                    {
                        label: 3,
                        text: "备用",
                        type: "noraml"
                    },
                    {
                        label: 0,
                        text: "闲置",
                        type: "unlive"
                    },
                    {
                        label: 4,
                        text: "待用",
                        type: "live"
                    }
                ]
            },
            labels: []
        };
    },
    created: {},
    computed: {
        usedTypes() {
            return this.used.types.filter(({ type }) =>
                this.cardItems.lifeType ? type !== "unlive" : type !== "live"
            );
        },
        labelIds:{
            get(){
                return this.cardItems.labelIds||[];
            },
            set(labelIds){
                this.cardItems.labelIds=labelIds||[];
            }
        }
    },
    created() {
        this.getLabels();
    },
    methods: {
        //获得标签
        async getLabels() {
            const { data } = await this.$axios.post(`/labels/list/1`);
            this.labels = data;
        }
    }
};
</script>
<style lang="less" scoped>
.additional-info-wrap {
    width: 100%;
}
</style>