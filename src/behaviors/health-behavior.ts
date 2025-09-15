import { Behavior } from "@engine";
import { CombatService } from "../services/combat-service";

export class HealthBehavior extends Behavior {
  private health: number;
  private maxHealth: number;

  constructor(initialHealth: number) {
    super();
    this.health = initialHealth;
    this.maxHealth = initialHealth;
  }

  get currentHealth() {
    return this.health;
  }

  get isAlive() {
    return this.health > 0;
  }

  get healthPercentage() {
    return this.health / this.maxHealth;
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    console.log(`[HealthBehavior] ${this.entity?.id} healed for ${amount}, health: ${this.health}/${this.maxHealth}`);
  }

  setMaxHealth(newMax: number) {
    const ratio = this.health / this.maxHealth;
    this.maxHealth = newMax;
    this.health = Math.floor(ratio * newMax);
  }

  protected override onInit() {
    super.onInit();
    
    // Try to subscribe to combat service if available
    try {
      const combat = this.getService(CombatService);
      combat.entityDamaged.subscribe(({ entity, amount }) => {
        if (entity === this.entity) {
          this.health -= amount;
          console.log(`[HealthBehavior] ${entity.id} took ${amount} damage, remaining health: ${this.health}`);
          if (this.health <= 0) {
            console.log(`[HealthBehavior] ${entity.id} died`);
            this.entity?.destroy();
          }
        }
      });
      console.log(`[HealthBehavior] ${this.entity?.id} subscribed to combat service`);
    } catch (error) {
      // Combat service not available in this scene - that's okay for safe zones
      console.log(`[HealthBehavior] ${this.entity?.id} initialized without combat service (peaceful area)`);
    }
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[HealthBehavior] ${this.entity?.id} entered scene with ${this.health}/${this.maxHealth} health`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Health regeneration or other health-related updates
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[HealthBehavior] ${this.entity?.id} exited scene`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[HealthBehavior] ${this.entity?.id} health behavior destroyed`);
  }
}