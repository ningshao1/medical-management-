(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7bd8e5ed"],{1150:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"annual-plan-list"},[a("kld-card",{attrs:{noheader:""}},[a("table-wrap",{attrs:{search:e.search.searchParam,"search-expanded":"","number-matched":e.page.total},on:{"update:search":function(t){e.$set(e.search,"searchParam",t)},settings:e.tableSettings,fresh:e.getList,"search-advanced":e.mergeSearch}},[a("div",{attrs:{slot:"header"},slot:"header"},[a("el-button",{attrs:{size:"mini"}},[e._v("新增")]),a("el-date-picker",{staticClass:"ml-10",staticStyle:{width:"120px"},attrs:{type:"year",format:"yyyy年","value-format":"yyyy",clearable:!1,editable:!1},model:{value:e.search.apApplyTime,callback:function(t){e.$set(e.search,"apApplyTime",t)},expression:"search.apApplyTime"}})],1),a("el-form",{attrs:{slot:"search-advanced","label-position":"left","label-width":"100px",model:e.searchAdvanced},slot:"search-advanced"},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"开始时间：",prop:"startTime"}},[a("el-date-picker",{attrs:{placeholder:"请选择开始时间"},model:{value:e.searchAdvanced.startTime,callback:function(t){e.$set(e.searchAdvanced,"startTime",t)},expression:"searchAdvanced.startTime"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"结束时间：",prop:"endTime"}},[a("el-date-picker",{attrs:{placeholder:"请选择结束时间"},model:{value:e.searchAdvanced.endTime,callback:function(t){e.$set(e.searchAdvanced,"endTime",t)},expression:"searchAdvanced.endTime"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"计划状态：",prop:"apApproveType"}},[a("el-select",{model:{value:e.searchAdvanced.apApproveType,callback:function(t){e.$set(e.searchAdvanced,"apApproveType",t)},expression:"searchAdvanced.apApproveType"}},e._l(e.planStatusOptions,function(e){var t=e.label,n=e.value;return a("el-option",{key:n,attrs:{label:t,value:n}})}),1)],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"采购类型：",prop:"apBuyType"}},[a("el-select",{model:{value:e.searchAdvanced.apBuyType,callback:function(t){e.$set(e.searchAdvanced,"apBuyType",t)},expression:"searchAdvanced.apBuyType"}},e._l(e.planTypeOptions,function(e){var t=e.label,n=e.value;return a("el-option",{key:n,attrs:{label:t,value:n}})}),1)],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"国产/进口：",prop:"apImport"}},[a("el-select",{model:{value:e.searchAdvanced.apImport,callback:function(t){e.$set(e.searchAdvanced,"apImport",t)},expression:"searchAdvanced.apImport"}},e._l(e.planImportOptions,function(e){var t=e.label,n=e.value;return a("el-option",{key:n,attrs:{label:t,value:n}})}),1)],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"选择科室：",prop:"sectionId"}},[a("tree-select",{attrs:{placeholder:"选择科室",data:e.departmentData,"first-expand":"",props:e.treeProps},model:{value:e.searchAdvanced.sectionId,callback:function(t){e.$set(e.searchAdvanced,"sectionId",t)},expression:"searchAdvanced.sectionId"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"单价起始：",prop:"apAssetMoneyStart"}},[a("kld-input-number",{attrs:{placeholder:"单价起始"},model:{value:e.searchAdvanced.apAssetMoneyStart,callback:function(t){e.$set(e.searchAdvanced,"apAssetMoneyStart",t)},expression:"searchAdvanced.apAssetMoneyStart"}},[a("template",{slot:"append"},[e._v("万元")])],2)],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"单价结束：",prop:"apAssetMoneyEnd"}},[a("kld-input-number",{attrs:{placeholder:"单价结束"},model:{value:e.searchAdvanced.apAssetMoneyEnd,callback:function(t){e.$set(e.searchAdvanced,"apAssetMoneyEnd",t)},expression:"searchAdvanced.apAssetMoneyEnd"}},[a("template",{slot:"append"},[e._v("万元")])],2)],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"总价起始：",prop:"apTotalPriceStart"}},[a("kld-input-number",{attrs:{placeholder:"总价起始"},model:{value:e.searchAdvanced.apTotalPriceStart,callback:function(t){e.$set(e.searchAdvanced,"apTotalPriceStart",t)},expression:"searchAdvanced.apTotalPriceStart"}},[a("template",{slot:"append"},[e._v("万元")])],2)],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"总价结束：",prop:"apTotalPriceEnd"}},[a("kld-input-number",{attrs:{placeholder:"总价结束"},model:{value:e.searchAdvanced.apTotalPriceEnd,callback:function(t){e.$set(e.searchAdvanced,"apTotalPriceEnd",t)},expression:"searchAdvanced.apTotalPriceEnd"}},[a("template",{slot:"append"},[e._v("万元")])],2)],1)],1)],1)],1),a("Tabs",{model:{value:e.search.temporary,callback:function(t){e.$set(e.search,"temporary",t)},expression:"search.temporary"}},[a("TabPane",{attrs:{label:"年度计划",name:"0"}}),a("TabPane",{attrs:{label:"临时计划",name:"1"}})],1),a("el-table",{directives:[{name:"load",rawName:"v-load",value:e.loading,expression:"loading"}],attrs:{data:e.data,"row-key":"apId",selected:e.selected,"visible-columns":e.visibleColumns},on:{"update:selected":function(t){e.selected=t}}},[a("el-table-column",{attrs:{type:"selection","reserve-selection":""}}),a("el-table-column",{attrs:{type:"index",index:e.startIndex,label:"序号"}}),a("el-table-column",{attrs:{label:"设备名称"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row.apAssetName;return a("text-ellipsis",{},[e._v(e._s(n))])}}])}),a("el-table-column",{attrs:{label:"申请科室"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row.osName;return a("text-ellipsis",{},[e._v(e._s(n))])}}])}),a("el-table-column",{attrs:{label:"申请ID",prop:"apId",width:"170px","column-key":"id"}}),a("el-table-column",{attrs:{label:"申请时间"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row.apApplyTime;return[e._v(e._s(e.dateFormat(a)))]}}])}),a("el-table-column",{attrs:{label:"采购类型","column-key":"type"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row.apBuyType;return[e._v(e._s(e.planTypeOptions[a].label))]}}])}),a("el-table-column",{attrs:{label:"国产/进口","column-key":"import"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row.apImport;return[e._v(e._s(e.planImportOptions[a].label))]}}])}),a("el-table-column",{attrs:{label:"申请数量",prop:"apAssetNum"}}),a("el-table-column",{attrs:{label:"单价(万元)"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row.apAssetMoney;return[e._v(e._s(a))]}}])}),a("el-table-column",{attrs:{label:"总价(万元)"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row.apTotalPrice;return[e._v(e._s(a))]}}])}),a("el-table-column",{attrs:{label:"状态","column-key":"status"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return e._l([e.getTablePlanStatus(n)],function(t){var n=t.text,l=t.color;return a("span",{class:"text-"+l},[e._v(e._s(n))])})}}])}),a("el-table-column",{attrs:{label:"申请理由","column-key":"reason"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row.apBuyWhy;return a("text-ellipsis",{},[e._v(e._s(n))])}}])})],1),a("div",{staticClass:"flex justify-content-between full-width",attrs:{slot:"footer"},slot:"footer"},[a("div",[a("dialog-plan-settings",{attrs:{data:e.selected},on:{success:e.getList}},[a("el-button",{attrs:{type:"default"}},[e._v("计划设置")])],1),a("el-button",{attrs:{type:"default"}},[e._v("批量下载")]),a("el-button",{attrs:{type:"default"}},[e._v("全部下载")]),a("el-button",{attrs:{type:"default"}},[e._v("年度预算设置")]),a("el-button",{attrs:{type:"default"}},[e._v("下载计划详情")])],1),a("el-pagination",{attrs:{"current-page":e.page.current,total:e.page.total,"page-size":e.page.size},on:{"update:currentPage":function(t){e.$set(e.page,"current",t)},"current-change":e.getList}})],1)],1)],1),a("set-columns-visible",{attrs:{visible:e.settings,items:e.configurableColumns},on:{"update:visible":function(t){e.settings=t}},model:{value:e.visibleColumns,callback:function(t){e.visibleColumns=t},expression:"visibleColumns"}})],1)},l=[],r=(a("96cf"),a("3b8d")),s=(a("6762"),a("2fdb"),a("0888")),i=a("9cef"),o=a("6eae"),c=a("e341"),u=a("9b5c"),p=a("ef67"),d=(a("7514"),a("1157")),f=a.n(d),v=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=f()(".el-table__body"),l=n.children("colgroup").children().length;if(n.find(".custom-insert-row").remove(),t){var r=f()('\n            <tr class="custom-insert-row">\n                <td colspan="'.concat(l,'" style="background-color: #eee;" class="px-10">\n                    ').concat(t,"\n                </td>\n            </tr>\n        "));r.children("td").css(a),n.children("tbody").children().eq(e).after(r)}},m=a("8759"),b=a("ff5a"),h=a("c680"),y=a("f731"),g={data:function(){return{departmentData:[]}},methods:{getDepartmentData:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){var t,a,n;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=this.hospitalId||this.osId||this.$store.state.userInfo.osId,e.next=3,this.$axios.get("/orgstruct/findAllTree/".concat(t));case 3:return a=e.sent,n=a.data,e.abrupt("return",this.departmentData=[n]);case 6:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()}},x=a("5a0c"),k=a.n(x),w=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"inline-block"},[a("div",{staticClass:"activator",on:{click:e.open}},[e._t("default")],2),a("el-dialog",{attrs:{title:"计划设置",width:"480px",visible:e.visible},on:{"update:visible":function(t){e.visible=t},closed:e.closedHandler}},[a("el-radio-group",{staticClass:"full-width",model:{value:e.type,callback:function(t){e.type=t},expression:"type"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-radio",{attrs:{label:3}},[e._v("公示，暂不投票")])],1),a("el-col",{attrs:{span:12}},[a("el-radio",{attrs:{label:4}},[e._v("公示，开始投票")])],1)],1),a("el-row",{staticClass:"mt-20",attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-radio",{attrs:{label:2}},[e._v("不公示")])],1)],1)],1),a("template",{slot:"footer"},[a("el-button",{attrs:{type:"default",size:"mini"},on:{click:e.close}},[e._v("取消")]),a("el-button",{attrs:{size:"mini",loading:e.submitLoading},on:{click:e.confirm}},[e._v("确认")])],1)],2)],1)},T=[],_={name:"dialog-plan-settings",props:{data:{type:Array,default:function(){return[]}}},data:function(){return{visible:!1,submitLoading:!1,type:null}},methods:{open:function(){this.visible=!0},close:function(){this.visible=!1},closedHandler:function(){this.type=null},confirm:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(0!==this.data.length){e.next=4;break}this.$message.warning({type:"warning",message:"请选择年度计划"}),e.next=18;break;case 4:if(this.type){e.next=8;break}this.$message.warning({type:"warning",message:"请选择年度计划状态"}),e.next=18;break;case 8:return this.submitLoading=!0,e.prev=9,e.next=12,this.$axios.put("/annualPlanTmp/updateAnnualPlanType",{approveType:this.type,ids:this.data.map(function(e){var t=e.apId;return t})});case 12:this.$emit("success"),this.$message.warning({type:"success",message:"设置成功"}),this.close();case 15:return e.prev=15,this.submitLoading=!1,e.finish(15);case 18:case"end":return e.stop()}},e,this,[[9,,15,18]])}));function t(){return e.apply(this,arguments)}return t}()}},A=_,I=a("2877"),$=Object(I["a"])(A,w,T,!1,null,null,null),C=$.exports,S={name:"annual-plan-list",mixins:[h["a"],y["a"],g],components:{TableWrap:s["a"],KldCard:i["a"],Tabs:m["a"],TabPane:b["a"],SetColumnsVisible:o["a"],TreeSelect:c["a"],KldInputNumber:u["a"],TextEllipsis:p["a"],DialogPlanSettings:C},data:function(){return{search:{searchParam:null,apApplyTime:String((new Date).getUTCFullYear()),temporary:"0"},searchAdvanced:{startTime:null,endTime:null,apBuyType:null,apApproveType:null,apImport:null,apHosId:this.$store.state.userInfo.osId,sectionId:null,apAssetMoneyStart:void 0,apAssetMoneyEnd:void 0,apTotalPriceStart:void 0,apTotalPriceEnd:void 0},settings:!1,visibleColumns:["id","type","import","status","reason"],selected:[]}},computed:{url:function(){return"/annualPlanTmp/listPC"},planStatusOptions:function(){return[{label:"全部",value:null},{label:"已申请",value:1},{label:"不公示",value:2},{label:"公示，暂不投票",value:3},{label:"公示，开始投票",value:4},{label:"委员会讨论(不通过)",value:5},{label:"院部讨论",value:6},{label:"院部讨论(不通过)",value:11},{label:"卫计委讨论",value:7},{label:"职工大会",value:8},{label:"完成",value:9},{label:"拒绝",value:10}]},planTypeOptions:function(){return[{label:"全部",value:null},{label:"0-20万",value:1},{label:"20万-50万",value:2},{label:"50万以上",value:3}]},planImportOptions:function(){return[{label:"全部",value:null},{label:"国产",value:1},{label:"进口",value:2}]},startIndex:function(){var e=this.page,t=e.current,a=e.size;return(t-1)*a+1},treeProps:function(){return{label:"osName",children:"lists"}},configurableColumns:function(){return[{label:"申请ID",value:"id"},{label:"采购类型",value:"type"},{label:"国产/进口",value:"import"},{label:"状态",value:"status"},{label:"申请理由",value:"reason"}]}},watch:{data:function(){this.updateCustomRow()},visibleColumns:function(){this.updateCustomRow()},searchInEffect:{deep:!0,handler:function(){this.selected=[]}}},created:function(){this.getDepartmentData(),this.getList()},methods:{dateFormat:function(e){return k()(e).format("YYYY-MM-DD")},tableSettings:function(){this.settings=!0},getTablePlanStatus:function(e){var t=[{},{text:"已申请",color:"blue"},{text:"不公示",color:"warning"},{text:"公示，暂不投票",color:"warning"},{text:"公示，开始投票",color:"warning"},{text:"委员会讨论(未通过)",color:"danger"},function(e){var t=e.hospitalType;return 0===t?{text:"院部讨论",color:"info"}:2===t?{text:"院部讨论(未通过)",color:"danger"}:void 0},{text:"卫计委讨论",color:"warning"},{text:"职工大会",color:"warning"},{text:"完成",color:"success"},function(e){var t=e.unitExpertsType,a=e.planningExpertsType,n=[t,a].includes(2)?"卫计委讨论":"职工大会";return{text:"".concat(n,"(未通过)"),color:"danger"}}][e.apApproveType];return"function"===typeof t&&(t=t(e)),t},batchDownload:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(t=this.selected,0!==t.length){e.next=5;break}this.$message({type:"warning",message:"请选择年度计划"}),e.next=7;break;case 5:return e.next=7,this.$axios.post("/annualPlanTmp/excelAll");case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),updateCustomRow:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$nextTick();case 2:v(1,".el-table",{textAlign:"right"});case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),removeCustomRow:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$nextTick();case 2:v();case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()}},P=S,L=Object(I["a"])(P,n,l,!1,null,"66cf3534",null),O=L.exports;a.d(t,"default",function(){return O})},e341:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.clickoutside,expression:"clickoutside"}],staticClass:"tree-select-wrap"},[a("el-input",{class:{"kld-input":e.largeInput,"side-input":!0},style:e.inputStyle,attrs:{disabled:e.disabled,readonly:e.readonly,placeholder:e.placeholder,clearable:e.clearable},on:{focus:e.inputFocus,clear:e.inputClear},nativeOn:{keydown:function(t){return e.keyboardOperation(t)}},model:{value:e.searchLabel,callback:function(t){e.searchLabel=t},expression:"searchLabel"}},[e._t("prepend",null,{slot:"prepend"}),e._t("append",null,{slot:"append"}),e._t("prefix",null,{slot:"prefix"}),e._t("suffix",null,{slot:"suffix"})],2),a("transition",{attrs:{name:"el-zoom-in-top"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-autocomplete-suggestion slide-up-tree"},[a("kld-tree",e._g(e._b({ref:"kld-tree",attrs:{data:e.data},scopedSlots:e._u([{key:"tree-item",fn:function(t){var a=t.node,n=t.data;return[e._t("tree-item",[e._v("\n                        "+e._s(a.label)+"\n                    ")],{node:a,data:n})]}}]),model:{value:e.currentKey,callback:function(t){e.currentKey=t},expression:"currentKey"}},"kld-tree",e.$attrs,!1),e.treeListeners))],1)])],1)},l=[],r=a("5176"),s=a.n(r),i=a("dd55"),o={name:"tree-select",components:{KldTree:i["a"]},props:{largeInput:{default:!1},disabled:{default:!1},value:{default:null,visible:!1},readonly:{default:!1},placeholder:{default:""},clearable:{default:!0},inputStyle:{default:function(){return{}}},filterOnFocus:Boolean,data:{default:function(){return[]}}},data:function(){return{currentLabel:"",searchLabel:"",visible:!1,triggerByClear:!1}},watch:{searchLabel:function(e){this.inputChange(e+"")}},computed:{currentKey:{get:function(){return this.value},set:function(e){this.$emit("input",e)}},$tree:function(){return this.$refs["kld-tree"]},treeListeners:function(){var e=this;return s()({},this.$listeners,{"current-change":function(){e.currentChange.apply(e,arguments)}})}},created:function(){},methods:{inputChange:function(e){return this.$tree.filter(e.trim().toLowerCase())},clickoutside:function(){this.visible=!1,this.searchLabel=this.currentLabel},keyboardOperation:function(e){this.$tree.keyboardOperation(e)},inputFocus:function(){this.visible=!0,this.$tree.scrollToSelected(),this.inputChange(this.filterOnFocus?this.currentLabel:"")},currentChange:function(e,t){if(this.$emit("current-change",e,t),this.visible=this.visible&&this.triggerByClear,this.triggerByClear=!1,!t)return this.currentLabel="",void(this.searchLabel="");var a=t.label;this.currentLabel=a,this.searchLabel=a},inputClear:function(){this.triggerByClear=!0,this.currentKey=null}}},c=o,u=a("2877"),p=Object(u["a"])(c,n,l,!1,null,"3c49038c",null);t["a"]=p.exports},f731:function(e,t,a){"use strict";t["a"]={computed:{userInfo:function(){return this.$store.state.userInfo},osId:function(){return this.userInfo.osId},hospitalId:function(){return this.osId},userId:function(){return this.userInfo.id}},methods:{isDefined:function(e){return void 0!==e&&null!==e},isNumber:function(e){return e===+e},isEmpty:function(e){return null===e||void 0===e||""===e}}}}}]);
//# sourceMappingURL=chunk-7bd8e5ed.ec90846e.js.map