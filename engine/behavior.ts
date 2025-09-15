import type { Service } from "./service";

/**
 * Base Behavior class for reusable modular logic units attached to entities
 */
export abstract class Behavior {
  protected entity?: import("./entity").Entity;
  protected scene?: import("./scene").Scene;

  /**
   * Called once when the behavior is fully constructed and references are available
   */
  protected onInit(): void {}

  /**
   * Called when the entity with this behavior becomes active inside a scene
   */
  protected onEnterScene(): void {}

  /**
   * Called once per frame
   */
  protected onUpdate(dt: number): void {}

  /**
   * Called when the entity with this behavior is removed from a scene
   */
  protected onExitScene(): void {}

  /**
   * Called for cleanup (event unsubscriptions, disposal)
   */
  protected onDestroy(): void {}

  // Internal lifecycle methods called by the engine
  _init(): void {
    this.onInit();
  }

  _enterScene(): void {
    this.onEnterScene();
  }

  _update(dt: number): void {
    this.onUpdate(dt);
  }

  _exitScene(): void {
    this.onExitScene();
  }

  _destroy(): void {
    this.onDestroy();
  }

  _setEntity(entity: import("./entity").Entity): void {
    this.entity = entity;
    this.scene = entity.scene;
  }

  /**
   * Get a service instance from the current scene or game
   */
  protected getService<T extends Service>(serviceClass: new (...args: any[]) => T): T {
    if (!this.scene) throw new Error("Behavior not attached to a scene");
    return this.scene.getService(serviceClass);
  }
}