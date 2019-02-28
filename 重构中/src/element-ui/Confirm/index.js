import Vue from 'vue';
import Confirm from './Confirm';
import Alert from './Alert';
import SilentConfirm from './SilentConfirm.js';
export const confirm = (opts = {}) => new Promise((resolve, reject) => {
    const Component = Vue.extend(Confirm);
    const vm = new Component({
        propsData: opts,
    });
    vm.$mount();
    vm.$on('action', type => {
        if (type === 'ok') {
            resolve();
        } else {
            reject();
        }
    });
    document.body.appendChild(vm.$el);
});

export const alert = (opts = {}) => new Promise((resolve, reject) => {
    const Component = Vue.extend(Alert);
    const vm = new Component({
        propsData: opts,
    });
    vm.$mount();
    vm.$on('action', type => {
        if (type === 'ok') {
            resolve();
        } else {
            reject();
        }
    });
    document.body.appendChild(vm.$el);
});



export const silentConfirm = (opts = {}) => new Promise((resolve, reject) => {
    const Component = Vue.extend(SilentConfirm);
    const vm = new Component({
        propsData: opts,
    });
    vm.$mount();
    vm.$on('action', (error, type, data) => {
        if (error) {
            reject(error)
        }
        resolve({ type, data })
    });
    document.body.appendChild(vm.$el);
});