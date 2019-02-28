import SupplierAdd from '../SupplierAdd';
import {mergeNoExpand} from '@/utils';
export default {
    name: 'supplier-edit',
    extends: SupplierAdd,
    data() {
        return {
            formData: {
                id: null
            },
        };
    },
    computed: {
        submitConfig() {
            return {
                method: 'put',
                url: ['/supplier', '/measurement/putMaintain', '/measurement/putMeasurement'][this.formData.type],
                data: this.formData
            }
        },
        queryId() {
            return this.$route.query.id;
        }
    },
    created() {
        this.getDetail();
    },
    methods: {
        async getDetail() {
            this.loading = true;
            try {
                const {data} = await this.$axios.get(`/supplier/${this.queryId}`);
                data.labelIds = data.labels.map(
                    label => label.labelId
                );
                //如果没有osID剔除字段不进行合并
                if (!data.osID) {
                    delete data.osID;
                }
                mergeNoExpand(this.formData, data);
            } finally {
                this.loading = false;
            }
        }
    }
}