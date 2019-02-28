import "@/assets/kld-icon/index.js";
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import directives from '@/utils/vue.directive.js';
import ElementUI from '@el/index.install.js';
import './utils/axios';
import "./styles/cover.scss";
Vue.use(ElementUI)
Vue.use(directives)
Vue.config.productionTip = false;
Vue.mixin({
    methods: {
        kldLimit(value) {
            return this.$store.state.limit && this.$store.state.limit[value] !== undefined
        }
    }
})
new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')