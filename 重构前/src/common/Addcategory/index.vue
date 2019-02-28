
<script>
    /*
    切换类别事件 GetCategory
    添加类别事件 AddCategory
    删除类别事件 DelCategory   
    */
import confirm from "@common/kld-confirm/index.js";
export default {
    props: {
        //列表数据
        CategoryData: {
            default() {
                return [];
            },
            type: Array
        },
        //标题
        title: {
            default: "保养类别",
            type: String
        },
        //控制显示删除和新增按钮
        delBtn:{
            default:false,
            type:Boolean
        }
    },
    data() {
        return {
            index: 0
        };
    },
    methods: {},
    created() {},
    render: function(createElement) {
        //头部
        let header = createElement(
            "div",
            {
                class: "title",
                
            },
            this.title
        );
        //中间渲染数据
        let content = createElement(
            "div",
            {
                class: "categoryScroll"
            },
            [
                createElement("ul", [
                    this.CategoryData.map((el, i) => {
                        return createElement(
                            "li",
                            {
                                on: {
                                    click: e => {
                                        //切换类别返回事件
                                        this.index = i;
                                        this.$emit("GetCategory", el);
                                    }
                                },
                                class:
                                    this.index === i
                                        ? " click_li"
                                        : " click_lis"
                            },
                            [
                                createElement(
                                    "span",
                                    {
                                        class: "textEllipsis"
                                    },
                                    el instanceof Object?el.name:''
                                ),
                                //删除事件
                                this.delBtn
                                    ? createElement(
                                          "span",
                                          {
                                              class: "textEllipsis",
                                              on: {
                                                  click: (e) => {
                                                      confirm({
                                                          title: "提示",
                                                          content: "是否删除",
                                                          maskClosable: true, //是否允许点击遮罩关闭 默认:false
                                                          okText: "确定", //确认按钮文本  默认:确认
                                                          cancelText: "取消", //确认取消文本  默认:取消
                                                          ok: () => {
                                                              this.$emit(
                                                                  "DelCategory",
                                                                  el,
                                                                  i
                                                              );
                                                          }
                                                      });
                                                      e.stopPropagation();
                                                      
                                                  }
                                              }
                                          },
                                          "删除"
                                      )
                                    : null
                            ]
                        );
                    })
                ])
            ]
        );
        let AddCategory = createElement("a", {
            style:{
                        position:"absolute",
                        display: 'inline-block',
                        height:'45px',
                        top:"0",
                        right:'5px',
                        color:'#0c83fa'
                        
                    },
        }, [
            createElement(
                "p",
                {
                    
                    on: {
                        click: () => {
                            //添加类别触发事件
                            this.$emit("AddCategory");
                        }
                    }
                },
                [createElement("span",{style:{color:'#0c83fa'}}, "+"), createElement("span",{style:{color:'#0c83fa'}}, "添加类别")]
            )
        ]);
        return createElement(
            "div",
            {
                style:{
                    position:'relative'
                },
                class: ["categoryLeft", "inspect"]
            },
            [header, content, this.delBtn?AddCategory:null]
        );
    }
};
</script>
