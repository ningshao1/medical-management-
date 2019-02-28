export default {
    data() {
        return {
            assetTypeData: []
        };
    },
    methods: {
        async getAssetTypeData() {
            const {data} = await this.$axios.get(`/assetTypes/typeAllTree`);
            return this.assetTypeData = data;
        }
    }
};