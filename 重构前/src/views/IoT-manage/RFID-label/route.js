const List = () => import('./list');

export default [
    {
        path: 'RFID-label',
        name: 'RFID-label',
        meta: {
            label: 'RFID标签管理'
        },
        component: List
    }
]