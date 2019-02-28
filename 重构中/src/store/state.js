import { initCheckLimit } from "@/utils";
const state = {
    token: JSON.parse(localStorage.getItem("__userToken___")),
    userInfo: JSON.parse(localStorage.getItem("__userInfo___")),
    limit: (() => {
        const limit = JSON.parse(localStorage.getItem("__userLimit___"));
        initCheckLimit(limit);
        return limit;
    })()
};
export default state;
