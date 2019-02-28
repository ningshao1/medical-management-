import remoteAddress from '@common/Address';

const route = [];
if (remoteAddress.startsWith('http://192.168')) {
    const ChangeRemoteAddress = () => import('./change-remote-address');

    route.push({
        path: '/cra',
        name: 'change-remote-address',
        component: ChangeRemoteAddress
    });
}

export default route;