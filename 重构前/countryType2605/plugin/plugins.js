const plugins=(function(Vue){
    return {
        kldConfirm:options => {
            const { title, content, ok, cancel, maskClosable, okText, cancelText } = {
                ...{
                    title: '提示',
                    content: '',
                    maskClosable: true,
                    okText: '确认',
                    cancelText: '取消'
                },
                ...options
            };
        
        
            const $el = new Vue({
                render(h) {
                    const confirmButton = [];
        
        
        
                    if (cancel !== false) {
                        confirmButton.push(h(
                            'Button',
                            {
                                class: ['kld-btn-default', 'kld-btn-small'],
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
                        },
                        class: 'kld-confirm',
                        nativeOn: {
                            animationend({ target }) {
                                if (target.classList.contains('ivu-modal-mask') && getComputedStyle(target).display === 'none') {
                                    document.body.removeChild($el);
                                }
                            }
                        }
                    }, [
                            h('span', {
                                style: {
                                    fontSize: '15px',
                                    display: "block",
                                    "text-align": "center",
                                    "padding": "20px 0 10px 0"
                                }
                            }, content),
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
                }
            }).$mount().$el;
        
            document.body.appendChild($el);
        }
    }

}(Vue));