import { Entity } from "@engine";
import { HealthBehavior } from "../../../behaviors/health-behavior";
import { AIBehavior } from "../../../behaviors/ai-behavior";
import { MovementBehavior } from "../../../behaviors/movement-behavior";

export class EnemyBoss extends Entity {
  private healthBehavior!: HealthBehavior;
  private aiBehavior!: AIBehavior;
  private movementBehavior!: MovementBehavior;
  private phase = 1;
  private specialAttackCooldown = 0;

  constructor(id?: string) {
    super(id ?? "boss");
    this.healthBehavior = this.addBehavior(new HealthBehavior(300));
    this.aiBehavior = this.addBehavior(new AIBehavior({ detectionRange: 15, attackRange: 3 }));
    this.movementBehavior = this.addBehavior(new MovementBehavior({ x: 10, y: 10 }));
  }

  get health() {
    return this.healthBehavior.currentHealth;
  }

  get isAlive() {
    return this.healthBehavior.isAlive;
  }

  get position() {
    return this.movementBehavior.currentPosition;
  }

  get currentPhase() {
    return this.phase;
  }

  get aiState() {
    return this.aiBehavior.currentState;
  }

  private updatePhase() {
    const healthPercentage = this.healthBehavior.healthPercentage;
    
    if (healthPercentage <= 0.3 && this.phase < 3) {
      this.phase = 3;
      this.onPhaseChange();
    } else if (healthPercentage <= 0.6 && this.phase < 2) {
      this.phase = 2;
      this.onPhaseChange();
    }
  }

  private onPhaseChange() {
    console.log(`[EnemyBoss] Boss ${this.id} entered phase ${this.phase}`);
    // Heal slightly on phase change
    this.healthBehavior.heal(50);
    // Reset special attack cooldown
    this.specialAttackCooldown = 0;
  }

  private performSpecialAttack() {
    switch (this.phase) {
      case 1:
        console.log(`[EnemyBoss] Boss ${this.id} performs ground slam attack`);
        break;
      case 2:
        console.log(`[EnemyBoss] Boss ${this.id} performs fire breath attack`);
        break;
      case 3:
        console.log(`[EnemyBoss] Boss ${this.id} performs devastating combo attack`);
        break;
    }
  }

  protected override onInit() {
    super.onInit();
    console.log(`[EnemyBoss] Boss enemy ${this.id} initialized`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[EnemyBoss] Boss enemy ${this.id} entered combat scene`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    this.updatePhase();
    
    // Special attack logic
    this.specialAttackCooldown -= dt;
    if (this.specialAttackCooldown <= 0) {
      const cooldownTime = this.phase === 3 ? 3 : this.phase === 2 ? 5 : 8;
      this.specialAttackCooldown = cooldownTime;
      this.performSpecialAttack();
    }
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[EnemyBoss] Boss enemy ${this.id} exited combat scene`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[EnemyBoss] Boss enemy ${this.id} destroyed - victory!`);
  }
}