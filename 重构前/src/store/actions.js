import $axios from "../libs/new-axios.js";
import axios from "@/libs/monitor-axios";
import uuid from "uuid/v1";
import md5 from "md5";
let treeWithTypeFormat = (assetType, typeList, children = "lists") => {
    let map = (function getNodeMap(list, map) {
        let len = list.length;
        for (; len--; ) {
            let node = list[len];
            map[node.id] = node;
            if (node[children] && node[children].length) {
                getNodeMap(node[children], map);
            }
        }
        return map;
    })(assetType, {});

    for (let i in typeList) {
        map[i].type = typeList[i] === undefined ? null : typeList[i];
    }
    return assetType;
};

export default {
    //获得国家分类树并缓存
    loadCountryTree({ state, commit }, reFresh = true) {
        if (state.kld_cache.countryTree && !reFresh) {
            return Promise.resolve(state.kld_cache.countryTree);
        }
        return $axios.get(`/assetTypes/typeAllTree`).then(res => {
            commit("setCountryTree", res);
            return Promise.resolve(res);
        });
    },
    //获得科室分类树并缓存
    loadDepartmentTree({ state, commit }, reFresh = true) {
        if (state.kld_cache.departmentTree && !reFresh) {
            return Promise.resolve(state.kld_cache.departmentTree);
        }
        return $axios
            .get(`orgstruct/findAllTree/${state.user_in.osId}`)
            .then(res => {
                commit("setDepartmentTree", res);
                return Promise.resolve(res);
            });
    },
    //获得国家分类树
    /**
     *
     * @param {*} param0
     * @param {是否携带计量信息} type
     */
    async loadCountryType({ state }, type = false) {
        const { data: assetType } = await $axios.get("/assetTypes/typeAllTree");
        if (type) {
            try {
                const { data: typeList } = await $axios.get(
                    `/assetTypes/findAssetTypes/${state.user_in.osId}`
                );
                return treeWithTypeFormat(assetType, typeList);
            } catch (e) {
                return assetType;
            }
        }
        return assetType;
    },

    //监控账户登陆
    async loginMonitorAccount({ state, commit }, { username, password }) {
        let monitorState = uuid();
        let loginPassword = md5(password);
        const {
            data: { access_token }
        } = await axios.post(`LoginAction.php`, {
            username,
            password: loginPassword,
            state: monitorState
        });
        let monitorUserInfo = {
            username,
            password: loginPassword,
            state: monitorState,
            access_token
        };
        if (access_token) {
            commit("setMonitorUserInfo", Object.assign({}, monitorUserInfo));
        }
        return Object.assign({}, monitorUserInfo);
    }
};
