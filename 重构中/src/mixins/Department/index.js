export default {
    data() {
        return {
            departmentData: []
        };
    },
    methods: {
        async getDepartmentData() {
            const
                hospitalId = this.hospitalId || this.osId || this.$store.state.userInfo.osId,
                {data} = await this.$axios.get(`/orgstruct/findAllTree/${hospitalId}`);

            return this.departmentData = [data];
        }
    }
};