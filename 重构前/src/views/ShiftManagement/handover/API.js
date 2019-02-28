const shiftInfo={
        successionOrders(){
            return [
                {
                    title:"接班人",
                    info:this.SOInfo.successorName
                },
                {
                    title:"科室",
                    info:this.SOInfo.departmentName
                },
                {
                    title:"交班人",
                    info:this.SOInfo.watchkeeperName
                },
                {
                    title:"交班时间",
                    info:this.SOInfo.handTime
                },
            ]
        },
        shiftDetail(){
            return [
                {
                    title:"交班人",
                    info:this.SOInfo.watchkeeperName
                },
                {
                    title:"交班时间",
                    info:this.SOInfo.handTime
                },
                {
                    title:"接班人",
                    info:this.SOInfo.successorName
                },
                {
                    title:"接班时间",
                    info:this.SOInfo.receiveTime
                },
                {
                    title:"科室",
                    info:this.SOInfo.departmentName
                },
            ]
        }
}
export { shiftInfo }