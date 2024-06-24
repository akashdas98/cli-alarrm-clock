import { isBefore } from "date-fns";
import Alarm from "./Alarm";
import display from "./display";

export default class AlarmClock {
  private alarms: Alarm[] = [];

  constructor() {
    this.setAlarm = this.setAlarm.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
    this.getAlarms = this.getAlarms.bind(this);
  }

  public setAlarm(time: Date): void {
    const now: Date = new Date();
    if (isBefore(now, time)) {
      this.alarms[this.alarms.length] = new Alarm(time);
    } else {
      display.setMessage("Unable to set alarm before current time.");
    }
  }

  public getAlarms(): Alarm[] {
    return [...this.alarms];
  }

  public deleteAlarm(index: number) {
    if (this.alarms.length > index && index >= 0) {
      this.alarms[index].clearAlarm();
      this.alarms.splice(index, 1);
      display.setMessage("Alarm deleted.");
    }
  }
}
