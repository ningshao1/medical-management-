import KldCard from "@c/KldCard";
export default {
    components: {
        [KldCard.name]: KldCard,
    },
    computed: {
        userInfo() {
            return this.$store.state.userInfo;
        },
        osId() {
            return this.userInfo.osId;
        },
        //资产id
        assetId() {
            return this.$route.params.id;
        },
    },
}