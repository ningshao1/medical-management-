import elTree from "element-ui/lib/tree";
const getChildState = node => {
    let all = true;
    let none = true;
    let allWithoutDisable = true;
    for (let i = 0, j = node.length; i < j; i++) {
        const n = node[i];
        if (n.checked !== true || n.indeterminate) {
            all = false;
            if (!n.disabled) {
                allWithoutDisable = false;
            }
        }
        if (n.checked !== false || n.indeterminate) {
            none = false;
        }
    }

    return { all, none, allWithoutDisable, half: !all && !none };
};

const reInitChecked = function(node) {
    if (node.childNodes.length === 0) return;

    const { all, none, half } = getChildState(node.childNodes);
    if (all) {
        node.checked = true;
        node.indeterminate = false;
    } else if (half) {
        node.checked = false;
        node.indeterminate = true;
    } else if (none) {
        node.checked = false;
        node.indeterminate = false;
    }

    const parent = node.parent;
    if (!parent || parent.level === 0) return;

    if (!node.store.checkStrictly) {
        reInitChecked(parent);
    }
};
export default {
    extends: elTree,
    name: elTree.name,
    created() {
        this.root.__proto__.setChecked = function setChecked(
            value,
            deep,
            recursion,
            passValue
        ) {
            // Source code
            // this.indeterminate = value === 'half';
            this.indeterminate = value === "half" || this.indeterminate;
            this.checked = value === true;

            if (this.store.checkStrictly) return;

            if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
                let { all, allWithoutDisable } = getChildState(this.childNodes);

                // Source code
                //   if (!this.isLeaf && (!all && allWithoutDisable)) {
                //     this.checked = false;
                //     value = false;
                //   }
                if (
                    !this.isLeaf &&
                    !all &&
                    (allWithoutDisable || this.indeterminate)
                ) {
                    this.checked = false;
                    value = false;
                }

                const handleDescendants = () => {
                    if (deep) {
                        const childNodes = this.childNodes;
                        for (let i = 0, j = childNodes.length; i < j; i++) {
                            const child = childNodes[i];
                            passValue = passValue || value !== false;
                            const isCheck = child.disabled
                                ? child.checked
                                : passValue;
                            child.setChecked(isCheck, deep, true, passValue);
                        }
                        const { half, all } = getChildState(childNodes);
                        if (!all) {
                            this.checked = all;
                            this.indeterminate = half;
                        }
                    }
                };

                if (this.shouldLoadData()) {
                    // Only work on lazy load data.
                    this.loadData(
                        () => {
                            handleDescendants();
                            reInitChecked(this);
                        },
                        {
                            checked: value !== false
                        }
                    );
                    return;
                } else {
                    handleDescendants();
                }
            }

            const parent = this.parent;
            if (!parent || parent.level === 0) return;

            if (!recursion) {
                reInitChecked(parent);
            }
        };
    },
    methods: {
        //element-ui 2.4.7 源码
        // handleKeydown: function handleKeydown(ev) {
        //     var currentItem = ev.target;
        //     if (currentItem.className.indexOf("el-tree-node") === -1) return;
        //     var keyCode = ev.keyCode;
        //     this.treeItems = this.$el.querySelectorAll(
        //         ".is-focusable[role=treeitem]"
        //     );
        //     var currentIndex = this.treeItemArray.indexOf(currentItem);
        //     var nextIndex = void 0;
        //     if ([38, 40].indexOf(keyCode) > -1) {
        //         // up、down
        //         ev.preventDefault();
        //         if (keyCode === 38) {
        //             // up
        //             nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
        //         } else {
        //             nextIndex =
        //                 currentIndex < this.treeItemArray.length - 1
        //                     ? currentIndex + 1
        //                     : 0;
        //         }
        //         this.treeItemArray[nextIndex].focus(); // 选中
        //     }
        //     if ([37, 39].indexOf(keyCode) > -1) {
        //         // left、right 展开
        //         ev.preventDefault();
        //         currentItem.click(); // 选中
        //     }
        //     var hasInput = currentItem.querySelector('[type="checkbox"]');
        //     if ([13, 32].indexOf(keyCode) > -1 && hasInput) {
        //         // space enter选中checkbox
        //         ev.preventDefault();
        //         hasInput.click();
        //     }
        // },

        handleKeydown: function handleKeydown(ev) {
            var currentItem = ev.target;
            if (currentItem.className.indexOf("el-tree-node") === -1) return;
            var keyCode = ev.keyCode;
            let treeItems = this.$el.querySelectorAll(
                "[role=treeitem]:not(.is-hidden)"
            );
            let siblingElems = elem => {
                //查找兄第节点
                var nodes = [];

                var _elem = elem;

                while ((elem = elem.previousSibling)) {
                    if (elem.nodeType === 1) {
                        nodes.push(elem);
                    }
                }

                var elem = _elem;

                while ((elem = elem.nextSibling)) {
                    if (elem.nodeType === 1) {
                        nodes.push(elem);
                    }
                }
                return nodes;
            };

            let viewElem = () => {
                //获得可见的dom节点

                let hiddens = [];
                return Array.prototype.slice.call(treeItems).filter(dom => {
                    if (hiddens.length) {
                        //根据文档流第一个dom节点必然是可见/可选的
                        let i = hiddens.length;
                        for (; i--; ) {
                            if (hiddens[i].contains(dom)) {
                                return false;
                            }
                        }
                    }

                    let siblings = siblingElems(dom.firstChild);
                    if (
                        siblings.length &&
                        siblings[0].style.display === "none"
                    ) {
                        hiddens.push(dom);
                    }

                    return true;
                });
            };
            this.treeItems = viewElem();
            var currentIndex = this.treeItemArray.indexOf(currentItem);
            var nextIndex = void 0;
            if ([38, 40].indexOf(keyCode) > -1) {
                // up、down
                ev.preventDefault();
                if (keyCode === 38) {
                    // up
                    nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
                } else {
                    nextIndex =
                        currentIndex < this.treeItemArray.length - 1
                            ? currentIndex + 1
                            : 0;
                }
                this.treeItemArray[nextIndex].focus(); // 选中
            }
            if ([37, 39].indexOf(keyCode) > -1) {
                // left、right 展开
                ev.preventDefault();
                currentItem.click(); // 选中
            }
            var hasInput = currentItem.querySelector('[type="checkbox"]');
            if ([13, 32].indexOf(keyCode) > -1 && hasInput) {
                // space enter选中checkbox
                ev.preventDefault();
                hasInput.click();
            }
        }
    }
};
