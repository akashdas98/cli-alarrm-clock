import * as readline from "readline";

class UserInput {
  private rl: readline.Interface | undefined;
  private interruptStack: { resolve: (value: string) => void }[] = [];
  private isMainActive: boolean = false;
  private mainResolve: ((value: string) => void) | undefined;

  constructor() {
    this.getUserInput = this.getUserInput.bind(this);
    this.getInterruptInput = this.getInterruptInput.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.createInterface = this.createInterface.bind(this);
    this.clearLine = this.clearLine.bind(this);
  }

  private createInterface() {
    if (this.rl) {
      this.rl.close();
    }
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl.on("line", (input) => this.handleInput(input));
  }

  private handleInput(input: string) {
    this.clearLine();
    if (this.interruptStack.length > 0) {
      const current = this.interruptStack.pop();
      if (current) {
        current.resolve(input.trim());
      }
    } else if (this.isMainActive) {
      this.isMainActive = false;
      this.rl?.pause();
      if (this.mainResolve) {
        this.mainResolve(input.trim());
      }
    }
  }

  private clearLine() {
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
  }

  public getUserInput(): Promise<string> {
    if (this.rl) {
      this.rl.close();
    }
    this.createInterface();
    return new Promise<string>((resolve) => {
      this.mainResolve = resolve;
      this.isMainActive = true;
    });
  }

  public getInterruptInput(): Promise<string> {
    if (!this.rl) {
      this.createInterface();
    }
    return new Promise<string>((resolve) => {
      this.interruptStack.push({ resolve });
    });
  }
}

export default new UserInput();
