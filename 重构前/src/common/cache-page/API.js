export default [
    {
        to:'asset-home',//待缓存页面
        next:['asset-details','asset-config']//待缓存页面被缓存的next条件页面
    }, 
    {
        to: 'contract-add',
        next:['add-supplier']
    },
    {
        to:'create-singer',
        next:['asset-details']
    },
    {
        to:'singer-center',
        next:['singer-detail']
    }
]