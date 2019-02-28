function treeDateFormat(data, checkedList=[],expand=false) { //checkedList传过来的已选择的树(shuzu)
    return data.map((v, i) => {
        if (v.lists) {
            return {
                title: v.osName || v.typeName,
                typeName:v.typeName||null,
                expand: false,
                id: v.id,
                expand,
                osParentid: v.osParentid || null,
                children: treeDateFormat(v.lists,checkedList, expand)
            }
        }
        return {
            title: v.osName || v.typeName,
            typeName:v.typeName||null,
            expand: false,
            id: v.id,
            checked: checkedList.length===0?false:checkedList.map(value=>value.id).includes(v.id),
            osParentid: v.osParentid || null
        }
    })
}
function contentDataFormat(data){
        let list=[];
        (function $(datas){
            datas.forEach(v=>{
                if(v.lists&&v.lists.length>0){
                    $(v.lists)
                }else{
                    list.push({
                        typeName: v.typeName,
                        id: v.id,
                    })
                }
            })
        })(data)
        return list;
    
}
function checkedListFormat(data){
    let list=[];
    (function $(datas){
        datas.forEach(v=>{
            if(v.lists&&v.lists.length>0){
                $(v.lists)
            }else{
                list.push({
                    typeName: v.typeName,
                    id: v.id,
                    checked:true,
                    title:v.title||''
                })
            }
        })
    })(data)
    return list;
    
}


export default {
    treeDateFormat,
    contentDataFormat,
    checkedListFormat
}