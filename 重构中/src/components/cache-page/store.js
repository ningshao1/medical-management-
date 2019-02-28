export const state={
    keepAliveInclude:[],

};
export const mutation={
    setKeepAliveInclude(state,val){
        state.keepAliveInclude=val;
    }
};
export const commit=function(mutationName,val){
    const handler=mutation[mutationName];
    if(!handler){
        throw new Error("请使用有效的mutation-name");
    }
    handler(state,val);

}   

