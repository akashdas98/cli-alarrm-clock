import AlarmClock from "./AlarmClock";
import Menu from "./Menu";
import { format, parse } from "date-fns";
import userInput from "./userInput";
import { isOfFormat } from "./utils";
import display from "./display";

class Main {
  private alarmClock: AlarmClock;
  private mainMenu = new Menu([
    {
      text: "Show Current Time",
      action: async () => display.setMessage(format(new Date(), "hh:mm a eee")),
    },
    {
      text: "Set Alarm",
      action: async () => await this.setAlarmAction(),
    },
    {
      text: "Delete Alarm",
      action: async () => await this.deleteAlarmAction(),
    },
  ]);

  constructor(alarmClock: AlarmClock) {
    this.alarmClock = alarmClock;

    this.setAlarmAction = this.setAlarmAction.bind(this);
    this.deleteAlarmAction = this.deleteAlarmAction.bind(this);
    this.start = this.start.bind(this);
  }

  private async setAlarmAction(): Promise<void> {
    display.setPrompt(
      "Enter alarm time and day of week (like - 12:30 PM mon): "
    );
    let input = await userInput.getUserInput();

    if (!isOfFormat(input, "hh:mm a eee")) {
      display.setMessage("Invalid time.");
    } else {
      const time: Date = parse(input, "hh:mm a eee", new Date());
      this.alarmClock.setAlarm(time);
    }
  }

  private async deleteAlarmAction(): Promise<void> {
    if (this.alarmClock.getAlarms().length !== 0) {
      const deleteAlarmMenu = new Menu(
        [
          ...this.alarmClock.getAlarms().map((alarm, index) => ({
            text: format(alarm.getTime(), "hh:mm a eee"),
            action: () => this.alarmClock.deleteAlarm(index),
          })),
          {
            text: "Exit",
            action: () => {},
          },
        ],
        "Select alarm to delete:"
      );
      display.setPrompt(deleteAlarmMenu.getMenuDisplay());
      await deleteAlarmMenu.run();
    } else {
      display.setMessage("No alarms to delete.");
    }
  }

  public async start(): Promise<void> {
    while (1) {
      display.setPrompt(this.mainMenu.getMenuDisplay());
      await this.mainMenu.run();
    }
  }
}

const alarmClock = new AlarmClock();
const main = new Main(alarmClock);

main.start();
