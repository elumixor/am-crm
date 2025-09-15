import { Entity } from "@engine";
import { HealthBehavior } from "../../../behaviors/health-behavior";
import { AIBehavior } from "../../../behaviors/ai-behavior";
import { MovementBehavior } from "../../../behaviors/movement-behavior";

export class EnemyBasic extends Entity {
  private healthBehavior!: HealthBehavior;
  private aiBehavior!: AIBehavior;
  private movementBehavior!: MovementBehavior;

  constructor(id?: string) {
    super(id);
    this.healthBehavior = this.addBehavior(new HealthBehavior(50));
    this.aiBehavior = this.addBehavior(new AIBehavior({ detectionRange: 8, attackRange: 1.5 }));
    this.movementBehavior = this.addBehavior(new MovementBehavior({ x: Math.random() * 20, y: Math.random() * 20 }));
    
    // Set up basic patrol behavior
    this.aiBehavior.setPatrolPoints([
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 5 },
      { x: 0, y: 5 }
    ]);
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

  get aiState() {
    return this.aiBehavior.currentState;
  }

  protected override onInit() {
    super.onInit();
    console.log(`[EnemyBasic] Basic enemy ${this.id} initialized`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[EnemyBasic] Basic enemy ${this.id} entered combat scene`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Basic enemy specific update logic
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[EnemyBasic] Basic enemy ${this.id} exited combat scene`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[EnemyBasic] Basic enemy ${this.id} destroyed`);
  }
}