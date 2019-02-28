<template>
    <div
            :class="wrapClasses"
            class="page-wrap"
    >
        <div v-if="! noBreadcrumb" class="page-wrap-breadcrumb full-width">
            <router-link to="/index/home">首页</router-link>
            <router-link
                        v-for="(v,i) of breadcrumb"
                        :key="i"
                        v-if="i>0 && i < breadcrumb.length - 1"
                        :to="{path: v.path, query: v.meta.query}"
            >
                <span class="breadcrumb-gt">></span>{{v.meta.label}}
            </router-link>
            <a v-else-if="i === breadcrumb.length - 1" href="javascript:">
                <span class="breadcrumb-gt">></span>{{v.meta.label}}
            </a>
        </div>
        <div v-if="! noTitle" class="page-wrap-pageTips full-width">
            <img v-if="imgUrl" :src="imgUrl" alt="">
            {{currentLabel}}
        </div>
        <div class="page-wrap-content full-width">
            <slot></slot>
        </div>
        <div v-if="! noFooter" class="page-wrap-footer full-width text-center fz-14">
            Copyright © {{new Date().getFullYear()}}.南京恺立达医院管理有限公司 版权所有
        </div>
    </div>
</template>
<script>
    export default {
        name: 'page-wrap',
        props: {
            noTitle: {
                type: Boolean,
                default: false
            },
            noBreadcrumb: {
                type: Boolean,
                default: false
            },
            noFooter: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            breadcrumb() {
                return this.$route.matched.filter(v => {
                    return !v.meta.breadcrumbHide && v.meta.label;
                });
            },
            currentLabel() {
                const {breadcrumb} = this;
                return breadcrumb[breadcrumb.length - 1].meta.label;
            },
            imgUrl() {
                for (const {meta: {imgUrl}} of this.$route.matched) {
                    if (typeof imgUrl === 'string') {
                        return imgUrl;
                    }
                }
            },
            isNested() {
                const Component = this.constructor;
                let parent = this.$parent;
                while (parent) {
                    if (parent.constructor === Component) {
                        return true;
                    }
                    parent = parent.$parent;
                }
                return false;
            },
            wrapClasses() {
                const isNotNested = ! this.isNested;
                return {
                    'has-footer': isNotNested,
                    'not-nested': isNotNested
                };
            }
        }
    };
</script>

<style lang="less" scoped>
    .page-wrap {
        width: 100%;
        &.not-nested{
            min-height: ~'calc(100vh - 73px)';
            padding-left: 1.5%;
            padding-right: 1.5%;
        }

        &-breadcrumb {
            display: flex;
            padding: 14px 0;
            >a {
                line-height: 20px;
                font-size: 12px;
                color: #999;
                &:first-child {
                    border-left: 5px solid #76bdc1;
                    padding-left: 10px;
                }

                .breadcrumb-gt {
                    color: #76bdc1
                }

                &:last-child {
                    color: #000;
                }
            }
        }

        &-pageTips {
            font-size: 18px;
            color: #020e0f;
            border-bottom: 1px solid #ccd2d7;
            padding-bottom: 10px;
            margin-bottom: 14px;
            img {
                width: 20px;
                height: 20px;
                margin-bottom: -3px;
            }
        }

        &.has-footer{
            padding-bottom: 75px;
            position: relative;
        }

        &-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 45px;
            margin-top: 30px;
            line-height: 45px;
            color: #333;
            background-color: rgba(2, 31, 57, .15);
        }
    }
</style>