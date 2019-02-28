import KldCard from "@c/KldCard";
import dayjs from 'dayjs'
import { createNamespacedHelpers } from "vuex";

const { mapState, mapMutations } = createNamespacedHelpers(
    "assetCatalog/addAndModify"
);
const State=mapState(["assetIdBySN"]);
export let baseMixin={
    components: { KldCard },
    props: {
        value: {
            default: ""
        }
    },
    computed: {
        userInfo(){
            return this.$store.state.userInfo;
        },
        osId(){
            return this.userInfo.osId;
        },
        assetId(){
            return this.$route.params.id;
        },
        //通过随机序列号生成的assetId
        assetIdBySN: {
            get:State['assetIdBySN'],
            set(val){
                this.setAssetIdBySN({assetIdBySN:val})
            }
        },
        //资产id
        assetId() {
            return this.$route.params.id;
        },
        //当前模式
        mode() {
            return this.$route.name.split("-")[1];
        },
        //是否是新增页面
        isAdd() {
            return this.mode === "add";
        },
        currentValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit("input", val);
            }
        }
    },
    methods: {
        ...mapMutations(["setAssetIdBySN"]),
        dayjs

    }
};
export default {
    mixins:[baseMixin],
    props:{
        assetItems: {
            default() {
                return {};
            }
        },
        originAssetItems:{
            default(){
                return {}
            }
        }

    },
    computed:{
        cardItems: {
            get() {
                return this.assetItems;
            },
            set(val) {
                this.$emit("update:assetItems", val);
            }
        },
    }
    
};
