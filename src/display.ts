import { format } from "date-fns";
import Menu from "./Menu";

class Display {
  private message?: string;
  private prompt?: string;
  private interrupts: string[] = [];

  constructor() {
    this.clear = this.clear.bind(this);
    this.displayPrompt = this.displayPrompt.bind(this);
    this.displayInterrupt = this.displayInterrupt.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.setPrompt = this.setPrompt.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.addInterrupt = this.addInterrupt.bind(this);
    this.removeLastInterrupt = this.removeLastInterrupt.bind(this);
    this.update = this.update.bind(this);
  }

  public clear() {
    console.clear();
  }

  public addInterrupt(interrupt: string) {
    this.interrupts.push(interrupt);
    this.update();
  }

  public removeLastInterrupt() {
    this.interrupts.pop();
    this.update();
  }

  public setPrompt(prompt: string): void {
    this.prompt = prompt;
    this.update();
  }

  public setMessage(message?: string): void {
    this.message = message;
    this.update();
  }

  private update() {
    this.clear();
    this.displayMessage();
    if (this.interrupts.length === 0) {
      this.displayPrompt();
    } else {
      this.displayInterrupt();
    }
  }

  private displayPrompt() {
    console.log(this.prompt + "\n");
  }

  private displayInterrupt() {
    if (this.interrupts.length > 0) {
      console.log(this.interrupts[this.interrupts.length - 1] + "\n");
    }
  }

  private displayMessage() {
    if (this.message) {
      console.log(this.message + "\n");
    }
  }
}

export default new Display();
