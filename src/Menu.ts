import userInput from "./userInput";
import display from "./display";

export interface MenuOption {
  text: string;
  action: (...args: any[]) => any;
}

export default class Menu {
  private header: string;
  private options: MenuOption[];
  private menuDisplay: string;

  constructor(options: MenuOption[], header?: string) {
    this.header = header || "Please choose an option:";
    this.options = options;
    this.menuDisplay = `${this.header}\n${this.options
      .map((o, i) => `${i + 1}. ${o.text}\n`)
      .join("")}`;

    this.askOption = this.askOption.bind(this);
    this.run = this.run.bind(this);
    this.getMenuDisplay = this.getMenuDisplay.bind(this);
  }

  private async askOption(): Promise<MenuOption> {
    let input: string = await userInput.getUserInput();
    let choice: number = parseInt(input.trim(), 10) - 1;
    while (
      Number.isNaN(choice) ||
      choice < 0 ||
      choice >= this.options.length
    ) {
      display.setMessage("Invalid choice! Try again.");
      input = await userInput.getUserInput();
      choice = parseInt(input.trim(), 10) - 1;
    }
    return this.options[choice];
  }

  private async askOptionInterrupt(): Promise<MenuOption> {
    let input: string = await userInput.getInterruptInput();
    let choice: number = parseInt(input.trim(), 10) - 1;
    while (
      Number.isNaN(choice) ||
      choice < 0 ||
      choice >= this.options.length
    ) {
      display.setMessage("Invalid choice! Try again.");
      input = await userInput.getInterruptInput();
      choice = parseInt(input.trim(), 10) - 1;
    }
    return this.options[choice];
  }

  public async run(): Promise<void> {
    const option = await this.askOption();
    await option.action();
  }

  public async interruptRun(): Promise<void> {
    const option = await this.askOptionInterrupt();
    await option.action();
  }

  public getMenuDisplay(): string {
    return this.menuDisplay;
  }
}
