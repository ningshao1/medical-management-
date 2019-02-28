import "@babel/polyfill";
import Vue from "vue";
import iView from "iview";
import router from "./router";
import App from "./app.vue";
import "./../base1.css";
import store from "./store";
import loadings from "./common/loading/loading";
import modulesFixed from "@common/modules-fixed";
import filterHandler from "@common/method/vue.filter";
import directiveHandler from "@common/method/vue.directive";
import "@common/method/vue.prototype";
//解决echarts内文字显示模糊的问题
Object.getOwnPropertyDescriptor(window, "devicePixelRatio") &&
    (window.devicePixelRatio = 2);

//全局提示配置
iView.Message.config({
    top: 80,
    duration: 4
});
Vue.use(iView);
Vue.use(modulesFixed);
Vue.component("Loading", loadings);

for (var key in filterHandler) {
    Vue.filter(key, filterHandler[key]);
}
for (var key in directiveHandler) {
    Vue.directive(key, directiveHandler[key]);
}

new Vue({
    el: "#app",
    router: router,
    store: store,
    watch: {
        "$store.state.limit": {
            handler(value) {
                Vue.prototype.limit = value;
                if (this.limit instanceof Array) {
                    let limit = {};
                    for (let i = 0; i < value.length; i++) {
                        //生成对象，减少权限判断计算
                        if (value[i] instanceof Object && value[i] !== null) {
                            limit[value[i].plPermission] = true;
                        }
                    }
                    Vue.prototype.checkLimit = name => {
                        return limit[name] || false;
                    };
                    Vue.prototype.ViewLimit = name => {
                        return limit[name] || false;
                    };
                }
            },
            immediate: true
        }
    },
    methods: {},
    render: h => h(App)
    // mounted: modalMaskBlur
});