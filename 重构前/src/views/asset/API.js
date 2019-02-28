function uploadImg(imglist,type){
    let config={
        headers: {'Content-Type': 'multipart/form-data'}
    }
    return Promise.all(
        imglist.filter(img=>img.type).map(img=>{
            let data=new FormData();
            data.append('file',img)
            return this.$axios.post(`/photo/${this.$store.state.user_in.osId}/${type}/upload`,data,config);
        })
    )
}
export {uploadImg}