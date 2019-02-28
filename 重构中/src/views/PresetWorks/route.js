import contractRoutes from './Contract/route';
import supplierRoutes from './Supplier/route';
const PresetWorks = () => import('./PresetWorks');
import installAcceptance from '@/views/Install-acceptance/route'; //安装验收
export default [
    {
        path: 'preset-works',
        name: 'preset-works',
        meta: {
            label: '预置工作'
        },
        component: PresetWorks,
        children: [
            ...contractRoutes,
            ...installAcceptance,
            ...supplierRoutes,
        ]
    }
]