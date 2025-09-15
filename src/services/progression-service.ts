import { Service } from "@engine";
import { EventEmitter } from "@elumixor/frontils";

export interface ProgressionData {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  skillPoints: number;
}

export class ProgressionService extends Service {
  readonly levelUp = new EventEmitter<{ newLevel: number }>();
  readonly experienceGained = new EventEmitter<{ amount: number }>();
  readonly skillPointsEarned = new EventEmitter<{ amount: number }>();

  private progression: ProgressionData = {
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    skillPoints: 0,
  };

  gainExperience(amount: number) {
    this.progression.experience += amount;
    this.experienceGained.emit({ amount });

    while (this.progression.experience >= this.progression.experienceToNextLevel) {
      this.levelUp();
    }
  }

  private levelUp() {
    this.progression.experience -= this.progression.experienceToNextLevel;
    this.progression.level++;
    this.progression.experienceToNextLevel = Math.floor(this.progression.experienceToNextLevel * 1.2);
    this.progression.skillPoints += 3;

    this.levelUp.emit({ newLevel: this.progression.level });
    this.skillPointsEarned.emit({ amount: 3 });
  }

  get currentProgression() {
    return { ...this.progression };
  }

  protected override onInit() {
    super.onInit();
    console.log("[ProgressionService] Initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[ProgressionService] Entered scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Progression system update logic
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[ProgressionService] Exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[ProgressionService] Destroyed");
  }
}