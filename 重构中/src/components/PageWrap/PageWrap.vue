<template>
    <Container class="page-wrap">
        <Aside v-show="hasMenu" width="auto">
            <scroll-bar>
                <PortalTarget
                        name="menu"
                        class="page-wrap-menu empty-none full-height"
                        @change="menuChange"
                        v-bind="portalCommonProps"
                ></PortalTarget>
            </scroll-bar>
        </Aside>
        <Container direction="vertical" class="full-height">
            <Container class="p-0 overflow-hidden">
                <scroll-bar class="flex-grow-lazy-1">
                    <Container class="page-wrap-content" style="box-sizing: initial" direction="vertical">
                        <Header class="page-wrap-title p-0" height="54px">
                            <PortalTarget
                                    name="title"
                                    class="flex full-height align-items-center fz-18"
                                    v-bind="portalCommonProps"
                            >
                                <h1 class="text-primary font-weight-normal fz-18">{{currentTitle}}</h1>
                            </PortalTarget>
                        </Header>
                        <Main class="page-wrap-view overflow-visible">
                            <router-view></router-view>
                        </Main>
                    </Container>
                </scroll-bar>
                <Aside v-show="hasTips" class="width-tips page-wrap-tips hidden-sm-and-down">
                    <scroll-bar>
                        <PortalTarget
                                name="tips"
                                class="full-height tips-target"
                                @change="tipsChange"
                                v-bind="portalCommonProps"
                        ></PortalTarget>
                    </scroll-bar>
                </Aside>
            </Container>
            <Footer class="p-0" height="auto">
                <PortalTarget
                        name="action"
                        class="page-wrap-action empty-none flex align-items-center"
                        v-bind="portalCommonProps"
                ></PortalTarget>
            </Footer>
        </Container>
    </Container>
</template>

<script>
    import {PortalTarget} from '@/plugins/portal-vue';
    import ScrollBar from '@/components/ScrollBar';
    import {Main, Container, Aside, Header, Footer} from 'element-ui';
    export default {
        name: "page-wrap",
        components: {
            PortalTarget,
            ScrollBar,
            Main, Container, Aside, Header, Footer
        },
        data() {
            return {
                hasTips: false,
                hasMenu: false,
            };
        },
        computed: {
            currentTitle() {
                const {currentRoute} = this;
                return currentRoute ? currentRoute.meta.label : 'title';
            },
            currentRoute() {
                return [...this.$route.matched].reverse().find(
                    ({meta: {breadcrumbHide}}) => ! breadcrumbHide
                );
            },
            portalSlotProps() {
                return {
                    title: this.currentTitle
                };
            },
            portalCommonProps() {
                return {
                    slotProps: this.portalSlotProps,
                    multiple: true
                };
            }
        },
        methods: {
            tipsChange(children) {
                this.hasTips = children.length > 0;
            },
            menuChange(children) {
                this.hasMenu = children.length > 0;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@/styles/var";
    $gutter: 24px;
    $width-tips: calc(#{406 / 1920 * 100vw} + #{$gutter});
    $height-page-wrap: calc(100vh - 7vw);
    $min-height-page-wrap: calc(100vh - #{51px + 84px});
    .page-wrap {
        width: 100%;
        height: $height-page-wrap;
        min-height: $min-height-page-wrap;
        &-content{
            padding: 0 $gutter;
        }
        &-view{
            padding: 0 0 $gutter;
        }
        &-title{

        }

        &-tips{
            padding: 54px 0 $gutter 0;
            >.scroll-bar-wrap{
                >.tips-target{
                    padding-right: $gutter;
                }
            }
        }

        &-action{
            border-top: 1px solid $border-color-base;
            height: 71px;
            background-color: #e5e7e8;
            padding: 0 $gutter;
        }

        /deep/{
            $width: $width-tips !important;

            .width-tips{
                width: $width;
            }

            .pl-tips{
                padding-left: $width;
            }

            .pr-tips{
                padding-right: $width;
            }
        }
    }
</style>