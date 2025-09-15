import { Service } from "@engine";
import { EventEmitter } from "@elumixor/frontils";

export class TimeService extends Service {
  readonly dayPassed = new EventEmitter<{ day: number }>();
  readonly timeChanged = new EventEmitter<{ hours: number; minutes: number }>();

  private gameTime = {
    day: 1,
    hours: 12,
    minutes: 0,
  };
  
  private timeScale = 1; // 1 real second = 1 game minute by default
  private accumulatedTime = 0;

  get currentTime() {
    return { ...this.gameTime };
  }

  get timeOfDay() {
    const totalMinutes = this.gameTime.hours * 60 + this.gameTime.minutes;
    if (totalMinutes < 360) return "night"; // 0-6 AM
    if (totalMinutes < 720) return "morning"; // 6 AM - 12 PM
    if (totalMinutes < 1080) return "afternoon"; // 12 PM - 6 PM
    return "evening"; // 6 PM - 12 AM
  }

  setTimeScale(scale: number) {
    this.timeScale = scale;
  }

  protected override onInit() {
    super.onInit();
    console.log("[TimeService] Initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[TimeService] Entered scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    this.accumulatedTime += dt * this.timeScale;
    
    // Update game time every minute
    if (this.accumulatedTime >= 1) {
      const minutesToAdd = Math.floor(this.accumulatedTime);
      this.accumulatedTime -= minutesToAdd;
      
      this.gameTime.minutes += minutesToAdd;
      
      if (this.gameTime.minutes >= 60) {
        const hoursToAdd = Math.floor(this.gameTime.minutes / 60);
        this.gameTime.minutes %= 60;
        this.gameTime.hours += hoursToAdd;
        
        if (this.gameTime.hours >= 24) {
          const daysToAdd = Math.floor(this.gameTime.hours / 24);
          this.gameTime.hours %= 24;
          this.gameTime.day += daysToAdd;
          
          this.dayPassed.emit({ day: this.gameTime.day });
        }
        
        this.timeChanged.emit({ hours: this.gameTime.hours, minutes: this.gameTime.minutes });
      }
    }
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[TimeService] Exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[TimeService] Destroyed");
  }
}