
let currentDate = new Date(new Date() - 60*60*24*1000 );

const state = {
    list: 3,
    systemUrl: null,
    token: JSON.parse(localStorage.getItem("token")),
    limit: JSON.parse(localStorage.getItem("limit")),
    user_in: JSON.parse(localStorage.getItem("user_in")),
    reload: "",
    dateRange: [
        new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 3,
            currentDate.getDate()
        ),
        currentDate
    ],
    kld_cache:{
        countryTree:null,
        departmentTree:null,
    },
    kldToUpperCase: value => {
        if (typeof value === "string") {
            return value.toUpperCase();
        } else {
            return value;
        }
    },
    localeDate(date, collapse = "-",exact=false) {
        let option=exact?{
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }:{
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
        if (!(date  instanceof Date)) {
            date=new Date(date);
        }
        return date
            .toLocaleString("zh", option)
            .replace(/\//g, collapse);
    },
    findNodes(fn, treeList, children = "children") {
        return (function find(fn, treeList, children) {
            let array = [];
            for (let i = 0; i < treeList.length; i++) {
                if (fn(treeList[i])) {
                    array.push(treeList[i]);
                }
                if (treeList[i][children] && treeList[i][children].length > 0) {
                    let final = find(fn, treeList[i][children], children);
                    if (final.length > 0) {
                        array = array.concat(final);
                    }
                }
            }
            return array;
        })(fn, treeList, children);
    },
    findNode( treeList,fn, children = "children") {
        return (function find(fn, treeList, children) {
            for (let i = 0; i < treeList.length; i++) {
                if (fn(treeList[i])) {
                    return treeList[i];
                }
                if (treeList[i][children] && treeList[i][children].length > 0) {
                    let final = find(fn, treeList[i][children], children);
                    if (final) {
                        return final;
                    }
                }
            }
            return null;
        })(fn, treeList, children);
    },



    monitorUserInfo:null
    
    
};

export default state;
