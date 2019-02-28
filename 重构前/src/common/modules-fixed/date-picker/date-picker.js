import { DatePicker } from "iview";
import { oneOf } from "iview/src/utils/assist";
import {
    initTimeDate,
    DEFAULT_FORMATS,
    TYPE_VALUE_RESOLVER_MAP,
    RANGE_SEPARATOR
} from "iview/src/components/date-picker/util";
import Vue from "vue";
let {
    components: { RangeDatePickerPanel }
} = DatePicker;
const rightPanel = {
    month: {
        year: 1,
        month: 0
    },
    year: {
        year: 10,
        month: 0
    },
    default: {
        year: 0,
        month: 1
    }
};
const getRightPanelDate = (date, { year, month }) => {
    return new Date(date.getFullYear() + year, date.getMonth() + month, 1);
};
RangeDatePickerPanel = Vue.extend({
    extends: RangeDatePickerPanel,
    name: RangeDatePickerPanel.name,
    data() {
        const [minDate, maxDate] = this.value.map(
            date => date || initTimeDate()
        );
        const leftPanelDate = this.startDate ? this.startDate : minDate;

        return {
            rightPanelDate: getRightPanelDate(
                leftPanelDate,
                rightPanel[this.selectionMode] || rightPanel["default"]
            )
        };
    },
    methods: {
        handlePreSelection(panel, value) {
            this[`${panel}PanelDate`] = value;
            const currentViewType = this[`${panel}PickerTable`];
            if (currentViewType === "year-table")
                this[`${panel}PickerTable`] = "month-table";
            else this[`${panel}PickerTable`] = `${this.currentView}-table`;

            if (!this.splitPanels) {
                const otherPanel = panel === "left" ? "right" : "left";
                this[`${otherPanel}PanelDate`] = value;
                this.changePanelDate(otherPanel, "Month", 1, false);
            }
        },
        setPanelDates(leftPanelDate) {
            this.leftPanelDate = leftPanelDate;
            const rightPanelDate = getRightPanelDate(
                leftPanelDate,
                rightPanel[this.selectionMode] || rightPanel["default"]
            );
            this.rightPanelDate = this.splitPanels
                ? new Date(Math.max(this.dates[1], rightPanelDate))
                : rightPanelDate;
        }
    },
    props: {
        selectionMode: {
            type: String,
            validator(value) {
                return oneOf(value, ["year", "month", "date", "time"]);
            },
            default: "month"
        }
    }
});
export default {
    extends: DatePicker,
    name: DatePicker.name,
    components: {
        RangeDatePickerPanel
    },
    props: {
        rangeType: {
            type: String,
            validator(value) {
                return oneOf(value, ["year", "month", "date", "time"]);
            },
            default: "date"
        }
    },
    methods: {
        handleFocus(e) {
            if (this.readonly || this.disabled) return;
            this.isFocused = true;
            if (e && e.type === "focus") return; // just focus, don't open yet
            this.visible = true;
        },
        onSelectionModeChange(type) {
            if (type.match(/^date/)) type = "date";
            this.selectionMode =
                oneOf(type, ["year", "month", "date", "time"]) && type;
            return this.selectionMode;
        },
        onSelectionModeChange(type) {
            if (type.match(/daterange/)) type = this.rangeType; //add
            if (type.match(/^date/)) type = "date";
            this.selectionMode =
                oneOf(type, ["year", "month", "date", "time"]) && type;
            return this.selectionMode;
        },
        parseDate(val) {
            const isRange = this.type.includes("range");
            const type = this.type;
            const parser = (
                TYPE_VALUE_RESOLVER_MAP[type] ||
                TYPE_VALUE_RESOLVER_MAP["default"]
            ).parser;
            const format =
                this.format || DEFAULT_FORMATS[this.rangeType || type]; //add
            const multipleParser = TYPE_VALUE_RESOLVER_MAP["multiple"].parser;

            if (val && type === "time" && !(val instanceof Date)) {
                val = parser(val, format);
            } else if (this.multiple && val) {
                val = multipleParser(val, format);
            } else if (isRange) {
                if (!val) {
                    val = [null, null];
                } else {
                    if (typeof val === "string") {
                        val = parser(val, format);
                    } else if (type === "timerange") {
                        val = parser(val, format).map(v => v || "");
                    } else {
                        const [start, end] = val;
                        if (start instanceof Date && end instanceof Date) {
                            val = val.map(date => new Date(date));
                        } else if (
                            typeof start === "string" &&
                            typeof end === "string"
                        ) {
                            val = parser(val.join(RANGE_SEPARATOR), format);
                        } else if (!start || !end) {
                            val = [null, null];
                        }
                    }
                }
            } else if (typeof val === "string" && type.indexOf("time") !== 0) {
                val = parser(val, format) || null;
            }

            return isRange || this.multiple ? val || [] : [val];
        },
        formatDate(value) {
            const format = DEFAULT_FORMATS[this.rangeType || this.type]; //add

            if (this.multiple) {
                const formatter = TYPE_VALUE_RESOLVER_MAP.multiple.formatter;

                return formatter(value, this.format || format);
            } else {
                const { formatter } =
                    TYPE_VALUE_RESOLVER_MAP[this.type] ||
                    TYPE_VALUE_RESOLVER_MAP["default"];

                return formatter(value, this.format || format);
            }
        }
    }
};
