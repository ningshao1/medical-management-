import Vue from 'vue';

function CreateProgressBar(value, el) { //创建 bar组件
    const existBar = document.querySelector(".kld-load-progress");
    if (value) {
        if (existBar) return;
        const bar = document.createElement('div');
        bar.classList.add("kld-load-progress", "load-progress");
        bar.appendChild(document.createElement('div'));
        if (el.classList.contains("el-dialog__body")) {

            el.style.position = "relative";
            bar.style.top = "1px";
            el.insertBefore(bar, el.children[0]);
        }
        else
            el.appendChild(bar);

    }
    else {
        setTimeout(() => {
            if (existBar) existBar.remove();
        }, 700)
    }

}

function parent(el) { //寻找父元素
    const navBar = document.querySelector(".navigation-bar");
    const dialogWrapper = document.querySelectorAll('.el-dialog__wrapper');
    const showWrapper = Array.from(dialogWrapper).find(v => v.style.display !== "none");
    if (dialogWrapper && showWrapper) {
        var parent = el;
        var classList = Array.from(parent.classList);
        while (parent.tagName !== "BODY" && !(classList.includes('el-dialog__body'))) {
            parent = parent.parentNode;
            classList = Array.from(parent.classList);
        }
        if (classList.includes('el-dialog__body'))
            return parent;
        else
            return navBar
    }
    else {
        return navBar;
    }
}
export const directives = {
    //注册全局自定义指令  当鼠标点击在绑定dom外时触发
    clickoutside: {
        bind(el, binding, vnode) {
            function documentHandler(e) {
                if (el.contains(e.target)) {
                    return false;
                }
                if (binding.expression) {
                    binding.value(e);
                }
            }
            el.__vueClickOutside__ = documentHandler;
            document.addEventListener("click", documentHandler);
        },
        update() {},
        unbind(el, binding) {
            document.removeEventListener("click", el.__vueClickOutside__);
            delete el.__vueClickOutside__;
        }
    },
    //为省略号添加title;
    "ellipsis-tooltip": {
        bind(el, binding, vnode) {
            function mouseenter(e) {
                el.title = el.scrollWidth > el.offsetWidth ? el.__title__  : "";
            }
            el.__title__ = binding.value;
            el.__mouseenter__ = mouseenter;
            el.classList.add("text-ellipsis");
            el.addEventListener("mouseenter", mouseenter);
        },
        update(el, binding) {
            el.__title__ = binding.value;
        },
        unbind(el, binding) {
            el.removeEventListener("mouseenter", el.__mouseenter__);
            delete el.__mouseenter__;
            delete el.__title__;
        }
    },
    load: {
        bind(el, binding, vnode) {
            Vue.nextTick(v => {
                CreateProgressBar(binding.value, parent(el))
            })
        },
        update(el, binding) {
            CreateProgressBar(binding.value, parent(el))
        },
        unbind(el) {
            const existBar = document.querySelector(".kld-load-progress");
            if (existBar) existBar.remove();


        }
    }
};

export default {
    install(Vue) {
        for (let key in directives) {
            Vue.directive(key, directives[key]);
        }
    }
};