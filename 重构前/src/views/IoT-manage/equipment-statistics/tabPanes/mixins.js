let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let currentMonthStart = new Date(currentYear, currentMonth);
export default {
    data() {
        return {
            search: {
                dateRange: [currentMonthStart, currentDate],
                departmentId: "",
                keyword: ""
            }
        };
    },
    watch: {
        search: {
            handler(val) {
                this.loadData();
                this.$nextTick(()=>{
                    this.$parent.selectAll(false)
                })
            },
            deep: true
        }
    },
    computed: {
        remoteDateRange() {
            return this.search.dateRange.map((time, i) =>
                time
                    ? `${this.$store.state.localeDate(time)} ${
                          i === 0 ? "00:00:00" : "23:59:59"
                      }`
                    : null
            );
        }
    },
    methods: {
        headerEllipsis(h, { row, index, column }) {
            let value = row[column.key];
            return h(
                "div",
                {
                    style: {
                        width: "100%"
                    },
                    directives: [
                        {
                            name: "ellipsis-tooltip",
                            value
                        }
                    ]
                },
                value
            );
        }
    }
};
