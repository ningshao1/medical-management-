(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1feb8066"],{"268f":function(e,n,t){e.exports=t("fde4")},"28b2":function(e,n,t){},"450d":function(e,n,t){},"454f":function(e,n,t){t("46a7");var u=t("584a").Object;e.exports=function(e,n,t){return u.defineProperty(e,n,t)}},"46a7":function(e,n,t){var u=t("63b6");u(u.S+u.F*!t("8e60"),"Object",{defineProperty:t("d9f6").f})},"85f2":function(e,n,t){e.exports=t("454f")},bd86:function(e,n,t){"use strict";t.d(n,"a",function(){return l});var u=t("85f2"),i=t.n(u);function l(e,n,t){return n in e?i()(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}},bf90:function(e,n,t){var u=t("36c3"),i=t("bf0b").f;t("ce7e")("getOwnPropertyDescriptor",function(){return function(e,n){return i(u(e),n)}})},c9ff:function(e,n,t){"use strict";t.r(n);var u=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"test-page-wrap"},[t("div",{class:{"menu-grid":!0,"is-collapse":!e.isCollapse}},[t("kld-menu",{attrs:{"default-active":e.$route.name,collapse:e.isCollapse,router:"",menu:e.menu},on:{select:e.selectHandle}})],1),t("div",{staticClass:"content-grid"},[t("router-view")],1),t("Cascader")],1)},i=[],l=(t("28b2"),t("450d"),t("c7ad")),r=t.n(l),a=t("f50d"),s=t("2bca"),o={name:"test-page",components:{KldMenu:a["a"],Cascader:r.a},props:{},data:function(){return{menu:s["a"][0],isCollapse:!1}},computed:{_menu:function(){}},created:function(){},methods:{selectHandle:function(){}}},c=o,m=t("2877"),f=Object(m["a"])(c,u,i,!1,null,"6ee6146d",null);n["default"]=f.exports},cebc:function(e,n,t){"use strict";t.d(n,"a",function(){return c});var u=t("268f"),i=t.n(u),l=t("e265"),r=t.n(l),a=t("a4bb"),s=t.n(a),o=t("bd86");function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},u=s()(t);"function"===typeof r.a&&(u=u.concat(r()(t).filter(function(e){return i()(t,e).enumerable}))),u.forEach(function(n){Object(o["a"])(e,n,t[n])})}return e}},f50d:function(e,n,t){"use strict";var u=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("kld-submenu",e._g(e._b({class:{"kld-menu-wrap":!0,"kld-menu-expand-wrap":!e.collapse,"kld-menu-collapse-wrap":e.collapse},attrs:{submenu:e.submenu,"max-level":e.maxLevel,level:e.level,"menu-item-class":e.menuItemClass,collapse:e.collapse},scopedSlots:e._u([{key:"menu-item",fn:function(n){var u=n.item,i=n.index;return[e._t("default",[t("div",{staticClass:"kld-menu-title"},[u.prefixIcon?t("i",{staticClass:"title-prefix-icon",class:u.prefixIcon}):e._e(),t("span",{attrs:{slot:"title"},slot:"title"},[e._v(e._s(u.title))])])],{item:u,index:i})]}}])},"kld-submenu",e.$attrs,!1),e.$listeners))},i=[],l=(t("7f7f"),t("a8db")),r=t("cebc"),a=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t(e.type,e._g(e._b({tag:"component",attrs:{index:e.submenu.index}},"component",e.$attrs,!1),e.$listeners),[e.type===e.submenuCommon?t("template",{slot:"title"},[e._t("menu-item",null,{item:e.submenu,index:e.index})],2):e._e(),e._l(e.submenu.children,function(n,u){return[e.level<e.maxLevel&&n.children&&n.children.length?t("kld-submenu",{key:u,attrs:{submenu:n,index:u,"max-level":e.maxLevel,level:e.level+1,type:e.submenuCommon,"menu-item-class":e.menuItemClass},scopedSlots:e._u([{key:"menu-item",fn:function(n){var t=n.item,u=n.index;return[e._t("menu-item",null,{item:t,index:u})]}}])}):t("el-menu-item",{key:u,class:e.menuItemClass,attrs:{index:n.index,route:n.route}},[e._t("menu-item",null,{item:n,index:u})],2)]})],2)},s=[],o=(t("c5f6"),{name:"kld-submenu",props:{type:{default:"el-menu"},submenu:{default:function(){return{}}},maxLevel:{default:1},level:Number,index:[String,Number],menuItemClass:String},data:function(){return{submenuCommon:"el-submenu"}},computed:{},created:function(){},methods:{}}),c=o,m=t("2877"),f=Object(m["a"])(c,a,s,!1,null,"10d4e588",null),d=f.exports,p={name:"kld-menu",components:{KldSubmenu:d},props:{menu:{default:function(){return[]}},maxLevel:{default:3},options:{default:function(){return{}}},collapse:{type:Boolean,default:!1},menuItemClass:{default:"kld-menu-item"}},data:function(){return{level:1,baseOptions:{indexKey:"name",title:"label",icon:"icon"}}},computed:{_menu:function(){return this.submenuFormat(this.menu)},submenu:function(){return{index:"__",children:this._menu}},_options:function(){return Object(r["a"])({},this.baseOptions,this.options)}},created:function(){},methods:{submenuFormat:function(e){var n=this;return e.filter(function(e){return e.meta&&!1!==e.meta.limit}).map(function(e){var t=e.children,u=e.meta,i=Object(l["a"])(e,["children","meta"]);return u=u||{},Object(r["a"])({},i,{index:e[n._options.indexKey],title:u[n._options.title],prefixIcon:u[n._options.icon],route:{name:e.name}},t?{children:n.submenuFormat(t)}:{})})}}},b=p,v=Object(m["a"])(b,u,i,!1,null,"c4a49030",null);n["a"]=v.exports},fde4:function(e,n,t){t("bf90");var u=t("584a").Object;e.exports=function(e,n){return u.getOwnPropertyDescriptor(e,n)}}}]);
//# sourceMappingURL=chunk-1feb8066.fddd2ece.js.map