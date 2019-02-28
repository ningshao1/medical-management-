const mutations = {
    increment(state, n) {
        state.list += n
    },
    set_url(state, url) {
        state.systemUrl = url;
    },


    setUserIn(state, user_in) {
        state.user_in = user_in;
        localStorage.setItem('user_in', JSON.stringify(user_in));
    },
    removeUserIn(state) {
        state.user_in = null;
        localStorage.removeItem('user_in');
    },



    setToken(state, token) {
        state.token = token;
        localStorage.setItem('token', JSON.stringify(token));
    },
    removeToken(state) {
        state.token = null;
        localStorage.removeItem('token');
    },





    setLimit(state, limit) {
        state.limit = limit;
        localStorage.setItem('limit', JSON.stringify(limit));
    },
    removeLimit(state) {
        state.limit = null;
        localStorage.removeItem('limit');
    },
    initReload(state,fn){
        state.reload=fn;
    },
    setDateRange(state,dateRange){
        state.dateRange=dateRange;
    },
    resetDateRange(state){
        let currentDate = new Date(new Date() - 60*60*24*1000 );
        state.dateRange= [
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 3,
                currentDate.getDate()
            ),
            currentDate
        ];
    },
    setCountryTree(state,countryTree){
        state.kld_cache.countryTree=countryTree;
    },
    setDepartmentTree(state,departmentTree){
        state.kld_cache.departmentTree=departmentTree;
    },
    setMonitorUserInfo(state,data){
        state.monitorUserInfo=data;
    }
    
};
export default mutations