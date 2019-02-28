<template>
    <div class="loading_" id="loadingState">
        <!-- <div class='loading_img'>
          <img src="../../img/loading.gif" alt="" :style='{width:size}'>
      </div> -->
        <Spin class='demo_'>
            <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
            <div style="color:#9abf9a;">{{content}}</div>
        </Spin>

    </div>
</template>
<script>
export default {
    name:'kld-loading',
    data() {
        return {
            show: null,
            element: null,
            timer: ""
        };
    },
    props: {
        size: {
            default: "50px"
        },
        content: {
            default: "加载中..."
        }
    },
    created() {
        this.$nextTick(() => {
            this.element = $("#loadingState").siblings();
            this.element.css("filter", "blur(4px)");
            this.timer = setTimeout(() => {
                this.Scope();
            }, 60);
        });
    },
    beforeDestroy() {
        clearTimeout(this.timer);
        this.element.css("filter", "");
    },
    methods: {
        Scope() {
            let time = setInterval(() => {
                if ($("#loadingState").css("display") === "none") {
                    this.element.css("filter", "");
                    clearInterval(time);
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.loading_ {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(250, 250, 250, 0.7);
    z-index: 99;
    .loading_img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.8;
        // img{
        //     width: 50px;
        // }
    }
    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }
    // .demo-spin-col {
    //     position: absolute;
    //     left: 50%;
    //     top: 50%;
    //     transform: translate(-50%, -50%);
    // }
    .demo_ {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .demo-spin-icon-load {
        color: #9abf9a;
    }
}
</style>
