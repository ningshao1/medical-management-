const system = () => import('./system')
const declaration = () => import('./declaration')
const label = () => import('./label')
// const role = () => import('./role')
const role = () => import('./role-individual.vue')
const department = () => import('./department')
const classification = () => import('./classification')
const manufactor = () => import('./manufactor')
const administration = () => import('./administration')
const basic = () => import('./basic')
const editbasic = () => import('./editbasic')
const doctorAssociationManagement=()=>import('./doctor-association-management/doctor-association-management.vue')
import dataDictionary from './data-dictionary/route';



export default {
    path: 'system',
    name: 'system',
    component: system,
    children: [
        {
            path: 'label',
            name: 'system-label',
            component: label
        },
        {
            path: 'role',
            name: 'system-role',
            component: role
        },
        {
            path: 'department',
            name: 'system-department',
            component: department
        },
        {
            path: 'classification',
            name: 'system-classification',
            component: classification
        },
        // {
        //     path: 'manufactor',
        //     name: 'system-manufactor',
        //     component: manufactor
        // },
        {
            path: 'declaration',
            name: 'system-declaration',
            component: declaration
        },
        ...dataDictionary,
        {
            path: 'administration',
            name: 'system-administration',
            component: administration
        },
        {
            path: 'basic',
            name: 'system-basic',
            component: basic
        },
        {
            path:'doctorAssociationManagement',
            name:'doctor-association-management',
            component:doctorAssociationManagement
        }
        // {
        //     path: 'editbasic',
        //     name: 'system-editbasic',
        //     component: editbasic
        // },
    ]
}