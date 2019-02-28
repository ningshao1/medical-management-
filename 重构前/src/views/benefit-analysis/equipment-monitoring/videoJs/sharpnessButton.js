export default (function(videojs) {
    let MenuButton = videojs.getComponent("MenuButton");
    let MenuItem = videojs.getComponent("MenuItem");
    let Component = videojs.getComponent("component");
    let itemList_ = [];

    class SharpnessItem extends MenuItem {
        constructor(player, option) {
            super(player, option);
            const { SharpnessButton, value, label, key } = option;
            this.SharpnessButton = option.SharpnessButton;
            this.itemInfo = { value, label, key };
            itemList_.push(this);
        }
        handleClick(evnet) {
            itemList_.forEach(sharpnessItem => {
                sharpnessItem.selected(
                    this.itemInfo.key === sharpnessItem.itemInfo.key
                );
            });
            this.SharpnessButton.setCurrentSharpness(this.itemInfo.key);
            if (this.options_.clickCallBack) {
                this.options_.clickCallBack(this.itemInfo, this.player_);
            }
        }
    }
    class SharpnessButton extends MenuButton {
        constructor(player, options = {}) {
            super(player, options);
            const { currentKey } = options;
            this.currentKey = currentKey;
            this.menuButtonDom = this.menuButton_.el();
            this.contentDom = this.menuButtonDom.querySelector(
                ".vjs-icon-placeholder"
            );
            this.menuButtonDom.title = "清晰度";
            this.menuButtonDom.style.fontSize = "1.2em";
        }
        addSharpnessItem({ value, label, key, clickCallBack }) {
            this.menu.addItem(
                new SharpnessItem(this.player_, {
                    selected: key === this.currentKey,
                    multiSelectable: false,
                    selectable: true,
                    key,
                    value,
                    label,
                    clickCallBack,
                    SharpnessButton: this
                })
            );
            if (this.currentKey) {
                this.setCurrentSharpness(this.currentKey);
            }
        }
        setCurrentSharpness(currentKey) {
            let current = itemList_.find(
                item => item.itemInfo.key === currentKey
            );
            if (!current) {
                return;
            }
            this.currentSharpness = current.itemInfo;
            const { key, value, label } = this.currentSharpness;
            this.contentDom.innerText = label;
        }
    }
    Component.registerComponent("SharpnessButton", SharpnessButton);
});
