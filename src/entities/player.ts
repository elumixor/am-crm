import { Entity } from "@engine";
import { HealthBehavior } from "../behaviors/health-behavior";
import { MovementBehavior } from "../behaviors/movement-behavior";

export class Player extends Entity {
  private healthBehavior!: HealthBehavior;
  private movementBehavior!: MovementBehavior;

  constructor() {
    super("player");
    this.healthBehavior = this.addBehavior(new HealthBehavior(100));
    this.movementBehavior = this.addBehavior(new MovementBehavior({ x: 0, y: 0 }));
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

  moveInput(input: import("../behaviors/movement-behavior").MovementInput) {
    this.movementBehavior.setInput(input);
  }

  heal(amount: number) {
    this.healthBehavior.heal(amount);
  }

  protected override onInit() {
    super.onInit();
    console.log("[Player] Player initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[Player] Player entered scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Player-specific update logic
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[Player] Player exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[Player] Player destroyed");
  }
}