<template>
    <div class="doctor-home">
        <el-row :gutter='20'>
            <el-col :span="16">
                <doctor-head v-if="!isEngineer">
                </doctor-head>
                <engineer-head v-else></engineer-head>

            </el-col>
            <el-col :span="8">
                <supplies-list></supplies-list>
            </el-col>

        </el-row>
        <el-row :gutter='20'>
            <el-col :span="16">
                <kld-doctor-progress v-if="!isEngineer"></kld-doctor-progress>
                <engineer-table></engineer-table>
            </el-col>
            <el-col :span="8">
                <new-list></new-list>

            </el-col>
        </el-row>
        <div class="doctor-calendar">
            <home-calendar :type="isEngineer ? 'engineer' : 'doctor'"></home-calendar>
        </div>

    </div>
</template>

<script>
// import head from "./components/doctor-head";
const head = () => import("./components/doctor-head");
const progress = () => import("./components/progress");
const engineerHead = () => import("./components/engineer-head");
const engineerTable = () => import("./components/engineer-table");
import supplies from "../common/supplies-list";
import newList from "../common/new-list";
import homeCalendar from "./components/home-calendar";
// import engineerHead from "./components/engineer-head";
// import engineerTable from "./components/engineer-table";
export default {
    name: "doctor-home",
    data() {
        return {};
    },
    components: {
        doctorHead: head,
        [supplies.name]: supplies,
        [newList.name]: newList,
        kldDoctorProgress: progress,
        [homeCalendar.name]: homeCalendar,
        engineerHead: engineerHead,
        engineerTable: engineerTable
    },
    computed: {
        isEngineer() {
            return this.$store.state.userInfo.roles[0].srName === "ENGINEER";
            // return true;
        }
    },
    created() {},
    methods: {}
};
</script>

<style scoped lang="less">
.doctor-calendar {
    margin-top: 20px;
    background: #fcfcfc;
}
</style>
