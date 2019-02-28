import titleImg from './image/闲置设备.png';

const borrowApplyApproval = () => import('./approval');

export default [
    {
        path: 'borrowApprovalWrap',
        component: { render: h => h('router-view') },
        redirect: { name: 'asset-examine' },
        meta: {
            label: "借用申请列表"
        },
        children: [{
            path: 'approval',
            name: 'borrow-approval-details',
            component: borrowApplyApproval,
            meta: {
                label: '借用申请审批',
                imgUrl: titleImg
            }
        }]
    }
];