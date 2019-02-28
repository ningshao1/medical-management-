// const Step1 = () => import('./steps-components/step1'),
//     Step2 = () => import('./steps-components/step2'),
//     Step3 = () => import('./steps-components/step3'),
//     Step4 = () => import('./steps-components/step4'),
//     Step5 = () => import('./steps-components/step5');

import Step1 from './steps-components/step1';
import Step2 from './steps-components/step2';
import Step3 from './steps-components/step3';
import Step4 from './steps-components/step4';
import Step5 from './steps-components/step5';

export default [
    {
        label:'提交申请',
        component: Step1,
    },
    {
        label:'委员会讨论',
        component: Step2,
    },
    {
        label: '院部讨论',
        component: Step3,
    },
    {
        label: '卫计委讨论',
        component: Step4,
    },
    {
        label: '职工大会',
        component: Step5,
    },
    {
        label: '审批通过'
    }
];