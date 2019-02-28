import icon from '@/views/image/设备物联.png';

const Wrap = () => import('./wrap');
//物联医疗设备总览
import equipmentOverview from './equipment-overview/route.js';
//物联设备统计表
import equipmentStatistics from './equipment-statistics/route.js';
//生命支持类设备
import lifeSupport from './Life-support/router.js';

import largeEquipment from './large-equipment/route'; //大型设备
import RFIDLabel from './RFID-label/route' //RFID标签管理
import collectTransport from './collect-transport/route';
export default [{
    path: 'IoT-manage',
    name: 'IoT-manage',
    meta: {
        label: '物联管理',
        imgUrl: icon
    },
    component: Wrap,
    children: [
        ...equipmentOverview,
        ...lifeSupport,
        ...largeEquipment,
        ...equipmentStatistics,
        ...RFIDLabel,
        ...collectTransport
    ]
}];