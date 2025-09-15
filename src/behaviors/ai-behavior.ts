import { Behavior } from "@engine";
import { CombatService } from "../services/combat-service";

export interface AIState {
  type: "idle" | "patrol" | "chase" | "attack" | "flee";
  target?: import("@engine").Entity;
  timer: number;
}

export class AIBehavior extends Behavior {
  private state: AIState = { type: "idle", timer: 0 };
  private detectionRange = 10;
  private attackRange = 2;
  private patrolPoints: Array<{ x: number; y: number }> = [];
  private currentPatrolIndex = 0;

  constructor(options?: { detectionRange?: number; attackRange?: number }) {
    super();
    if (options?.detectionRange) this.detectionRange = options.detectionRange;
    if (options?.attackRange) this.attackRange = options.attackRange;
  }

  setPatrolPoints(points: Array<{ x: number; y: number }>) {
    this.patrolPoints = points;
    this.currentPatrolIndex = 0;
  }

  get currentState() {
    return { ...this.state };
  }

  private findNearestPlayer() {
    // In a real implementation, this would search for player entities within detection range
    // For now, we'll return undefined as this is just an example
    return undefined;
  }

  private distanceToTarget(target: import("@engine").Entity) {
    // In a real implementation, this would calculate actual distance
    // For now, we'll return a random value as this is just an example
    return Math.random() * 15;
  }

  private moveTowards(target: import("@engine").Entity | { x: number; y: number }) {
    // In a real implementation, this would move the entity towards the target
    console.log(`[AIBehavior] ${this.entity?.id} moving towards target`);
  }

  private performAttack(target: import("@engine").Entity) {
    const combat = this.getService(CombatService);
    const damage = 10 + Math.floor(Math.random() * 10); // 10-20 damage
    combat.damageEntity(target, damage);
    console.log(`[AIBehavior] ${this.entity?.id} attacked ${target.id} for ${damage} damage`);
  }

  protected override onInit() {
    super.onInit();
    console.log(`[AIBehavior] ${this.entity?.id} AI initialized`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[AIBehavior] ${this.entity?.id} AI entered scene`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    this.state.timer += dt;

    switch (this.state.type) {
      case "idle":
        // Look for targets or start patrolling
        const target = this.findNearestPlayer();
        if (target) {
          this.state = { type: "chase", target, timer: 0 };
        } else if (this.patrolPoints.length > 0 && this.state.timer > 2) {
          this.state = { type: "patrol", timer: 0 };
        }
        break;

      case "patrol":
        if (this.patrolPoints.length > 0) {
          const currentPoint = this.patrolPoints[this.currentPatrolIndex];
          this.moveTowards(currentPoint);
          
          // Simulate reaching patrol point
          if (this.state.timer > 3) {
            this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
            this.state = { type: "idle", timer: 0 };
          }
        }
        break;

      case "chase":
        if (this.state.target) {
          const distance = this.distanceToTarget(this.state.target);
          if (distance <= this.attackRange) {
            this.state = { type: "attack", target: this.state.target, timer: 0 };
          } else if (distance > this.detectionRange) {
            this.state = { type: "idle", timer: 0 };
          } else {
            this.moveTowards(this.state.target);
          }
        }
        break;

      case "attack":
        if (this.state.target && this.state.timer > 1) { // Attack every second
          this.performAttack(this.state.target);
          this.state.timer = 0;
          
          const distance = this.distanceToTarget(this.state.target);
          if (distance > this.attackRange) {
            this.state = { type: "chase", target: this.state.target, timer: 0 };
          }
        }
        break;

      case "flee":
        // Move away from target
        if (this.state.target) {
          // In a real implementation, this would move away from the target
          console.log(`[AIBehavior] ${this.entity?.id} fleeing from ${this.state.target.id}`);
        }
        if (this.state.timer > 5) {
          this.state = { type: "idle", timer: 0 };
        }
        break;
    }
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[AIBehavior] ${this.entity?.id} AI exited scene`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[AIBehavior] ${this.entity?.id} AI destroyed`);
  }
}