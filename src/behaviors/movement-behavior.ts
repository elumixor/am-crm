import { Behavior } from "@engine";

export interface MovementInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
}

export class MovementBehavior extends Behavior {
  private velocity = { x: 0, y: 0 };
  private position = { x: 0, y: 0 };
  private speed = 5; // units per second
  private runMultiplier = 2;
  private input: MovementInput = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
  };

  constructor(initialPosition?: { x: number; y: number }) {
    super();
    if (initialPosition) {
      this.position = { ...initialPosition };
    }
  }

  get currentPosition() {
    return { ...this.position };
  }

  get currentVelocity() {
    return { ...this.velocity };
  }

  setInput(input: Partial<MovementInput>) {
    this.input = { ...this.input, ...input };
  }

  setPosition(position: { x: number; y: number }) {
    this.position = { ...position };
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  teleport(position: { x: number; y: number }) {
    this.position = { ...position };
    this.velocity = { x: 0, y: 0 };
    console.log(`[MovementBehavior] ${this.entity?.id} teleported to (${position.x}, ${position.y})`);
  }

  private updateVelocity() {
    let moveX = 0;
    let moveY = 0;

    if (this.input.left) moveX -= 1;
    if (this.input.right) moveX += 1;
    if (this.input.forward) moveY -= 1;
    if (this.input.backward) moveY += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071; // 1/sqrt(2)
      moveY *= 0.7071;
    }

    const currentSpeed = this.speed * (this.input.run ? this.runMultiplier : 1);
    this.velocity.x = moveX * currentSpeed;
    this.velocity.y = moveY * currentSpeed;
  }

  protected override onInit() {
    super.onInit();
    console.log(`[MovementBehavior] ${this.entity?.id} movement initialized at (${this.position.x}, ${this.position.y})`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[MovementBehavior] ${this.entity?.id} movement entered scene`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    this.updateVelocity();
    
    // Apply velocity to position
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Optional: Add bounds checking
    // this.position.x = Math.max(0, Math.min(worldWidth, this.position.x));
    // this.position.y = Math.max(0, Math.min(worldHeight, this.position.y));
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[MovementBehavior] ${this.entity?.id} movement exited scene`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[MovementBehavior] ${this.entity?.id} movement destroyed`);
  }
}