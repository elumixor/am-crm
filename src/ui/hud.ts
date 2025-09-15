import { Widget } from "@engine";
import { CombatService } from "../services/combat-service";
import { ProgressionService } from "../services/progression-service";

export class HUD extends Widget {
  private playerHealth = 100;
  private playerLevel = 1;
  private playerExperience = 0;

  protected override onInit() {
    super.onInit();
    
    const combat = this.getService(CombatService);
    const progression = this.getService(ProgressionService);

    combat.entityDamaged.subscribe(({ entity, amount }) => {
      if (entity.id === "player") {
        // In a real implementation, we'd get the actual health from the player entity
        this.playerHealth = Math.max(0, this.playerHealth - amount);
        this.updateHealthDisplay();
        console.log(`[HUD] Player health updated: ${this.playerHealth}`);
      }
    });

    progression.levelUp.subscribe(({ newLevel }) => {
      this.playerLevel = newLevel;
      this.updateLevelDisplay();
      console.log(`[HUD] Player level updated: ${this.playerLevel}`);
    });

    progression.experienceGained.subscribe(({ amount }) => {
      // In a real implementation, we'd get the actual experience from the progression service
      this.playerExperience += amount;
      this.updateExperienceDisplay();
      console.log(`[HUD] Player experience updated: ${this.playerExperience}`);
    });

    console.log("[HUD] HUD initialized with event subscriptions");
  }

  private updateHealthDisplay() {
    // In a real implementation, this would update the actual UI elements
    console.log(`[HUD] Health display updated: ${this.playerHealth}/100`);
  }

  private updateLevelDisplay() {
    // In a real implementation, this would update the actual UI elements
    console.log(`[HUD] Level display updated: Level ${this.playerLevel}`);
  }

  private updateExperienceDisplay() {
    // In a real implementation, this would update the actual UI elements
    console.log(`[HUD] Experience display updated: ${this.playerExperience} XP`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[HUD] HUD entered scene and is now visible");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // HUD update logic (animations, timers, etc.)
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[HUD] HUD exited scene and is now hidden");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[HUD] HUD destroyed and cleaned up");
  }
}