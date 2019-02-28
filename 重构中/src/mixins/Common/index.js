export default {
    computed:{
        userInfo(){
            return this.$store.state.userInfo;
        },
        osId(){
            return this.userInfo.osId;
        },
        hospitalId() {
            return this.osId;
        },
        userId() {
            return this.userInfo.id;
        }
    },
    methods:{
        isDefined(item){
            return item!==undefined&&item!==null;
        },
        isNumber(item){
            return item===+item;
        },
        isEmpty(item){
            return item===null||item===undefined||item===""
        }
    }
}