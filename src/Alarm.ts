import { format } from "date-fns";
import Menu, { MenuOption } from "./Menu";
import display from "./display";
import { resolve } from "path";

export default class Alarm {
  private timeout: NodeJS.Timeout | null = null;
  private time: Date;
  private snoozeCounter: number = 0;

  constructor(time: Date) {
    this.time = time;
    this.setAlarm(time);

    display.setMessage(`Alarm set for ${format(this.time, "hh:mm a eee")}`);

    this.stop = this.stop.bind(this);
    this.snooze = this.snooze.bind(this);
    this.alarm = this.alarm.bind(this);
    this.setAlarm = this.setAlarm.bind(this);
    this.clearAlarm = this.clearAlarm.bind(this);
    this.getTime = this.getTime.bind(this);
  }

  public getTime(): Date {
    return this.time;
  }

  public setAlarm(time: Date): void {
    this.time = time;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(
      async () => await this.alarm(),
      time.getTime() - new Date().getTime()
    );
  }

  private async alarm(): Promise<void> {
    const alarmMenuOptions: MenuOption[] = [
      {
        text: "Stop",
        action: () => this.stop(),
      },
    ];
    if (this.snoozeCounter < 3) {
      alarmMenuOptions.push({
        text: "Snooze",
        action: () => this.snooze(),
      });
    }
    const alarmMenu = new Menu(alarmMenuOptions, "ALARM!! Choose an option: ");
    display.addInterrupt(alarmMenu.getMenuDisplay());
    await alarmMenu.interruptRun();
    display.removeLastInterrupt();
  }

  public clearAlarm() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private stop(): void {
    display.setMessage("Alarm Stopped!");
    this.clearAlarm();
  }

  private snooze(): void {
    if (this.snoozeCounter < 3) {
      const snoozedTime = new Date(this.time.getTime() + 1000 * 60 * 5);
      display.setMessage(`Snoozed till ${format(snoozedTime, "hh:mm a")}`);

      this.setAlarm(snoozedTime);
      this.snoozeCounter++;
    }
  }
}
