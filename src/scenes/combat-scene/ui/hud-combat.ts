import { Widget } from "@engine";
import { CombatService } from "../../../services/combat-service";
import { ProgressionService } from "../../../services/progression-service";

export class HUDCombat extends Widget {
  private enemyCount = 0;
  private combatTime = 0;
  private damageDealt = 0;

  protected override onInit() {
    super.onInit();
    
    const combat = this.getService(CombatService);
    const progression = this.getService(ProgressionService);

    combat.entityDamaged.subscribe(({ entity, amount }) => {
      if (entity.id === "player") {
        console.log(`[HUDCombat] Player took ${amount} damage - update health bar`);
        this.updatePlayerHealthBar();
      } else {
        this.damageDealt += amount;
        console.log(`[HUDCombat] Enemy ${entity.id} took ${amount} damage - total damage dealt: ${this.damageDealt}`);
        this.updateDamageCounter();
      }
    });

    progression.experienceGained.subscribe(({ amount }) => {
      console.log(`[HUDCombat] Experience gained: ${amount} - show XP popup`);
      this.showExperienceGain(amount);
    });

    console.log("[HUDCombat] Combat HUD initialized");
  }

  private updatePlayerHealthBar() {
    // In a real implementation, this would update the health bar UI
    console.log("[HUDCombat] Updating player health bar animation");
  }

  private updateDamageCounter() {
    // In a real implementation, this would update the damage counter UI
    console.log(`[HUDCombat] Damage counter updated: ${this.damageDealt}`);
  }

  private showExperienceGain(amount: number) {
    // In a real implementation, this would show a floating XP gain text
    console.log(`[HUDCombat] Showing +${amount} XP popup`);
  }

  private updateEnemyCounter() {
    // In a real implementation, this would update the enemy counter UI
    console.log(`[HUDCombat] Enemies remaining: ${this.enemyCount}`);
  }

  setEnemyCount(count: number) {
    this.enemyCount = count;
    this.updateEnemyCounter();
  }

  showBossHealthBar(bossEntity: import("@engine").Entity) {
    // In a real implementation, this would show a boss health bar
    console.log(`[HUDCombat] Showing boss health bar for ${bossEntity.id}`);
  }

  hideBossHealthBar() {
    // In a real implementation, this would hide the boss health bar
    console.log("[HUDCombat] Hiding boss health bar");
  }

  showVictoryScreen() {
    // In a real implementation, this would show victory UI
    console.log(`[HUDCombat] Victory! Combat time: ${this.combatTime.toFixed(1)}s, Damage dealt: ${this.damageDealt}`);
  }

  showDefeatScreen() {
    // In a real implementation, this would show defeat UI
    console.log("[HUDCombat] Defeat! Try again?");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    this.combatTime = 0;
    this.damageDealt = 0;
    console.log("[HUDCombat] Combat HUD active - combat started");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    this.combatTime += dt;
    
    // Update combat-specific UI elements
    // Handle combat input, update timers, etc.
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[HUDCombat] Combat HUD inactive - combat ended");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[HUDCombat] Combat HUD destroyed");
  }
}