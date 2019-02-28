import $axios from "@/utils/axios.js";
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

const actions = {
    //获得国家分类树
    /**
     *
     * @param {*} param0
     * @param {是否携带计量信息} type
     */
    async loadCountryType({ state }, type = false) {
        const typeAllTree = () => {
            return $axios.get("/assetTypes/typeAllTree");
        };
        const findAssetTypes = async () => {
            try {
                return await $axios.get(
                    `/assetTypes/findAssetTypes/${state.userInfo.osId}`
                );
            } catch (e) {
                return {};
            }
        };

        if (!type) {
            const { data } = await typeAllTree();
            return data;
        }

        const [{ data: assetType }, { data: typeList }] = await Promise.all([
            typeAllTree(),
            findAssetTypes()
        ]);
        return typeList ? treeWithTypeFormat(assetType, typeList) : assetType;
    },
    //获得科室分类树
    async loadDepartmentTree({ state, commit }) {
        const { data } = await $axios.get(
            `orgstruct/findAllTree/${state.userInfo.osId}`
        );
        return data;
    }
};
export default actions;
