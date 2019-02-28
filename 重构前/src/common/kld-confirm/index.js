import Vue from 'vue';

export default options => {
    const { title, content, ok, cancel, maskClosable, okText, cancelText,closable } = {
        ...{
            title: '提示',
            content: '',
            maskClosable: true,
            okText: '确认',
            cancelText: '取消',
            closable:true
        },
        ...options
    };


    const $el = new Vue({
        name: 'kld-confirm',
        render(h) {
            const confirmButton = [];



            if (cancel !== false) {
                confirmButton.push(h(
                    'Button',
                    {
                        class: ['kld-btn-default', 'kld-btn-small'],
                        props: {
                            disabled: ! this.confirmShow
                        },
                        on: {
                            click: () => {
                                cancel && cancel();
                                this.confirmShow = false;
                            }
                        },
                        style: {
                            width: "85px",
                            fontSize: "13px",
                            height: "36px",
                            marginRight:'8px'
                        }
                    },
                    cancelText
                ));
            }

            if (ok !== false) {
                confirmButton.push(h(
                    'Button',
                    {
                        class: ['kld-btn', 'kld-btn-small'],
                        props: {
                            disabled: ! this.confirmShow
                        },
                        on: {
                            click: () => {
                                ok && ok();
                                this.confirmShow = false;
                            }
                        },
                        style: {
                            width: "85px",
                            fontSize: "13px",
                            height: "36px",
                            marginLeft:'8px'
                        }
                    },
                    okText
                ));
            }




            return h('Modal', {
                props: {
                    title,
                    value: this.confirmShow,
                    maskClosable,
                    closable,
                    'class-name': 'vertical-center-modal'
                },
                class: 'kld-confirm',
                nativeOn: {
                    animationend: ({ target }) => {
                        if (target.classList.contains('ivu-modal-mask') && getComputedStyle(target).display === 'none') {
                            this.$destroy();
                        }
                    }
                }
            }, [
                    h('div', {
                        style: {
                            fontSize: '15px',
                            display: "block",
                            "text-align": "center",
                            "padding": "20px 0 10px 0"
                        },
                        domProps: {//modify by ck
                            innerHTML: content
                        },
                    }),
                    h('div', {
                        slot: 'footer',
                        style: {
                            textAlign: 'center',
                            border: "none"
                        }
                    }, confirmButton)
                ]);
        },
        data: {
            confirmShow: false
        },
        mounted() {
            this.$nextTick(() => this.confirmShow = true);
        },

        beforeDestroy() {
            document.body.removeChild($el);
        }
    }).$mount().$el;

    document.body.appendChild($el);
};