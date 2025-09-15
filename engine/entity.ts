import type { Behavior } from "./behavior";
import type { Service } from "./service";

let entityIdCounter = 0;

/**
 * Base Entity class representing world objects that can have behaviors
 */
export abstract class Entity {
  readonly id: string;
  readonly behaviors: Behavior[] = [];
  scene?: import("./scene").Scene;

  constructor(id?: string) {
    this.id = id ?? `entity_${++entityIdCounter}`;
  }

  /**
   * Add a behavior to this entity
   */
  addBehavior<T extends Behavior>(behavior: T): T {
    this.behaviors.push(behavior);
    behavior._setEntity(this);
    if (this.scene) behavior._init();
    return behavior;
  }

  /**
   * Remove a behavior from this entity
   */
  removeBehavior(behavior: Behavior): void {
    const index = this.behaviors.indexOf(behavior);
    if (index >= 0) {
      behavior._destroy();
      this.behaviors.splice(index, 1);
    }
  }

  /**
   * Get a behavior of a specific type
   */
  getBehavior<T extends Behavior>(behaviorClass: new (...args: any[]) => T): T | undefined {
    return this.behaviors.find(behavior => behavior instanceof behaviorClass) as T;
  }

  /**
   * Called once when the entity is fully constructed and references are available
   */
  protected onInit(): void {}

  /**
   * Called when the entity becomes active inside a scene
   */
  protected onEnterScene(): void {}

  /**
   * Called once per frame
   */
  protected onUpdate(dt: number): void {}

  /**
   * Called when removed from a scene
   */
  protected onExitScene(): void {}

  /**
   * Called for cleanup (event unsubscriptions, disposal)
   */
  protected onDestroy(): void {}

  // Internal lifecycle methods called by the engine
  _init(): void {
    for (const behavior of this.behaviors) {
      behavior._init();
    }
    this.onInit();
  }

  _enterScene(): void {
    for (const behavior of this.behaviors) {
      behavior._enterScene();
    }
    this.onEnterScene();
  }

  _update(dt: number): void {
    for (const behavior of this.behaviors) {
      behavior._update(dt);
    }
    this.onUpdate(dt);
  }

  _exitScene(): void {
    for (const behavior of this.behaviors) {
      behavior._exitScene();
    }
    this.onExitScene();
  }

  _destroy(): void {
    for (const behavior of this.behaviors) {
      behavior._destroy();
    }
    this.onDestroy();
  }

  _setScene(scene: import("./scene").Scene): void {
    this.scene = scene;
    for (const behavior of this.behaviors) {
      behavior._setEntity(this);
    }
  }

  /**
   * Get a service instance from the current scene or game
   */
  protected getService<T extends Service>(serviceClass: new (...args: any[]) => T): T {
    if (!this.scene) throw new Error("Entity not attached to a scene");
    return this.scene.getService(serviceClass);
  }

  /**
   * Destroy this entity
   */
  destroy(): void {
    if (this.scene) {
      this.scene.removeEntity(this);
    }
  }
}