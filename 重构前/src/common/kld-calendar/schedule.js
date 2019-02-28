export class Schedule {
    constructor(options) {
        if (typeof Schedule.id === 'number') {
            Schedule.id += 1;
        } else {
            Schedule.id = 0;
        }

        this.id = Schedule.id.toString();
        this.isAllday = true;
        this.isReadOnly = true;
        this.category = 'allday';


        this.title = options.title;
        this.start = options.start;
        this.end = options.end || options.start;
        this.raw = options.raw;
        this.borderColor = this.bgColor = options.bgColor || '#2d8cf0';
        this.color = options.color || '#fff';
    }
}