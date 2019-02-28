import KldCard from"@c/KldCard";
export const baseMixin={
    computed: {
        id(){
            return this.$route.params.id;
        }
    },
};
export default {
    mixins:[baseMixin],
    components:{KldCard},
    data(){
        return {

            keepAlive:true
        }
    },
    props:{
        keepAliveInclude:Function
    },
    created() {
        if(this.keepAlive){
            this.keepAliveInclude(this.$options.name,true);
        }
    },
}
