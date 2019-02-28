//modal遮罩的高斯模糊效果
export default () => {
    const app = document.getElementById('app'),
        allOpenedModal = [],
        observerConfig = {
            attributes: true,
            attributeFilter: ['style']
        };


    document.addEventListener('animationstart', ({ target, animationName }) => {

        if (target.classList.contains('ivu-modal-mask') && animationName === 'ivuFadeIn') {
            const observerStyle = new MutationObserver(() => {
                if (getComputedStyle(target).display === 'none') {
                    const index = allOpenedModal.indexOf(target);

                    if (index !== -1) {
                        allOpenedModal.splice(index, 1);

                        if (allOpenedModal.length === 0) {
                            observerStyle.disconnect();
                            app.classList.remove('blur');
                        }

                    }

                }
            });

            app.classList.add('blur');
            allOpenedModal.push(target);
            observerStyle.observe(target, observerConfig);
        }

    }, false);

};