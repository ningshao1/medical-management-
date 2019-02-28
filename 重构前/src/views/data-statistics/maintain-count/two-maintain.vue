<script type="text/jsx">
    import InspectCount from '../inspect-count';

    export default {
        name: "two-maintain",
        extends: InspectCount,

        computed: {
            // displayBarNames() {
            //     return [
            //         '二级保养任务数',
            //         '二级保养设备数',
            //         '已完成设备数',
            //         '未完成设备数',
            //         '完成率',
            //         '任务逾期数',
            //     ];
            // },
            requestURLPrepend() {
                return 'maintenanceSchedule';
            },
        }
    }
</script>