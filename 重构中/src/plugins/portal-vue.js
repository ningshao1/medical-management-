/**
 * 文档: https://linusborg.github.io/portal-vue/
 * 只能用FireFox打开
* */

import PortalVue from 'portal-vue';

const {Portal, PortalTarget, Wormhole} = PortalVue;

const PortalTargetFixed = {
    extends: PortalTarget,
    name: PortalTarget.name,
    mounted() {
        const {ownTransports} = this;
        if (ownTransports.length > 0) {
            this.emitChange(ownTransports, []);
        }
    }
};

export {Portal, PortalTargetFixed as PortalTarget, Wormhole};

export default PortalVue;

