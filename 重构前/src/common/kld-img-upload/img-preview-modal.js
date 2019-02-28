import Vue from 'vue';


export default imgUrl => {
    let $el = null;
    const imgPreviewModal = new Vue({
        render(h) {
            return h(
                'Modal',
                {
                    props: {
                        width: 1000,
                        title: '查看图片',
                        'class-name': 'vertical-center-modal',
                        value: this.modalShow
                    },
                    nativeOn: {
                        animationend({target}) {
                            if (target.classList.contains('ivu-modal-mask') && getComputedStyle(target).display === 'none') {
                                document.body.removeChild($el);
                            }
                        }
                    }
                },
                [
                    h(
                        'div',
                        {
                            class: 'show-img-modal',
                            style: {
                                textAlign: 'center'
                            }
                        },
                        [
                            h(
                                'a',
                                {
                                    attrs: {
                                        href: imgUrl,
                                        title: '点击查看原图',
                                        target: '_blank'
                                    },
                                    style: {
                                        display: 'block'
                                    }
                                },
                                [h('img', {
                                    attrs: {src: imgUrl},
                                    style: {
                                        maxWidth: '100%',
                                        maxHeight: '633px'
                                    }
                                })]
                            )
                        ]
                    ),
                    h(
                        'div',
                        {slot: 'footer'},
                        [
                            h(
                                'Button',
                                {
                                    class: 'kld-btn kld-btn-small',
                                    on: {
                                        click: () => {
                                            this.modalShow = false;
                                        }
                                    }
                                },
                                '确认'
                            )
                        ]
                    )
                ]
            );
        },
        data: {
            modalShow: false,
        },
        mounted() {
            this.modalShow = true;
        }
    });

    imgPreviewModal.$mount();
    document.body.appendChild($el = imgPreviewModal.$el)
}