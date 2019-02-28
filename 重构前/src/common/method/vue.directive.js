export default {
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
                el.title = el.scrollWidth > el.offsetWidth ? el.__title__ : "";
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
    loading: {
        bind(el, binding, vnode) {
            if (typeof binding.value === 'boolean') {
                createSpin(el, binding.value);
            }

        },
        update(el, binding) {
            if (typeof binding.value === 'boolean') {
                if (!(el.querySelector('.kld-spin'))) return
                if (binding.value) {
                    $(el.querySelector('.kld-spin')).siblings().css({ 'filter': 'blur(2px)' })
                    el.querySelector('.kld-spin').style.display = 'block';
                }
                else {
                    $(el.querySelector('.kld-spin')).siblings().css({ 'filter': '' })
                    el.querySelector('.kld-spin').style.display = 'none';
                }
            }
        },
        unbind(el) {
            if (el.querySelector('.kld-spin')) {
                el.querySelector('.kld-spin').remove();
                $(el.querySelector('.kld-spin')).siblings().css({ 'filter': '' })
            }
        }
    }
};

function createSpin(el, show) {
    var fragment = document.createDocumentFragment();
    var ivuSpin = fragment.appendChild(document.createElement("div"));
    ivuSpin.style.background = 'rgba(250, 250, 250, 0.7)';
    ivuSpin.style.display = show ? "block" : "none";
    ivuSpin.classList.add('ivu-spin',
        'ivu-spin-default',
        'ivu-spin-fix',
        'ivu-spin-show-text', 'kld-spin')
    var spanMain = ivuSpin.appendChild(document.createElement("div"));
    spanMain.classList.add(`ivu-spin-main`);
    var spin = spanMain.appendChild(document.createElement("i"));
    spin.classList.add("demo-spin-icon-load", "ivu-icon", "ivu-icon-load-c");
    spin.style.fontSize = '18px'
    var title = spanMain.appendChild(document.createElement('div'));
    title.innerText = '加载中...';
    el.style.position = "relative";
    el.appendChild(fragment)
}