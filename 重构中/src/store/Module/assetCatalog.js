export default {
    //module:"assetCatalog"
    namespaced:true,
    state:{
       
    },
    mutations:{
        
    },
    modules:{
        addAndModify:{
            namespaced:true,
            state:{
                assetIdBySN:null
            },
            mutations:{
                setAssetIdBySN(state,{assetIdBySN}){
                    state.assetIdBySN=assetIdBySN;
                }
            }
        }
    }
}