import Vue from 'vue';
const createTextVNode = Vue.prototype._v;
const VNode = createTextVNode().constructor;
const isVNode = vnode => vnode instanceof VNode;


const getVNodeTextContent = vnodes => {
    let result = '';
    if (! Array.isArray(vnodes)) {
        vnodes = [vnodes];
    }

    for (const vnode of vnodes) {
        if (! isVNode(vnode)) {
            continue;
        }
        if (Array.isArray(vnode.children)) {
            result += getVNodeTextContent(vnode.children);
        } else if (vnode.componentOptions && Array.isArray(vnode.componentOptions.children)) {
            result += getVNodeTextContent(vnode.componentOptions.children);
        } else if (typeof vnode.text === 'string') {
            result += vnode.text;
        } else if (vnode.elm) {
            result += vnode.elm.textContent;
        }
    }

    return result;
};
export {createTextVNode, isVNode, getVNodeTextContent, VNode as default};