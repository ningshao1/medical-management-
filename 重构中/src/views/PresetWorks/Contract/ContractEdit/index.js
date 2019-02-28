import ContractAdd from '../ContractAdd';
import {mergeNoExpand} from '@/utils';
export default {
    extends: ContractAdd,
    name: 'contract-edit',
    computed: {
        queryId() {
            return this.$route.query.id;
        },
    },
    created() {
        this.getDetail();
    },
    methods: {
        async getDetail() {
            this.loading = true;
            try {
                const {data} = await this.$axios.get(`/contracts/${this.hospitalId}/${this.queryId}`);
                if (data) {
                    data.assetIds = data.assets.map(
                        asset => ({
                            assetId: asset.id,
                            assetWarrntyDate: asset.assetWarrntyDate,
                            departmentId: asset.departmentId,
                            hosId: asset.hosId,


                            assetName: asset.assetName,
                            assetClass: asset.assetClass,
                            brandName: asset.brandName,
                        })
                    );
                    data.labelIds = data.labels.map(
                        label => label.labelId
                    );
                    data.pics = data.attachments;
                    mergeNoExpand(this.formData, data);
                }
            } finally {
                this.loading = false;
            }
        }
    }
};