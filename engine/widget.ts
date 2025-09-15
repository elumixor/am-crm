import type { Service } from "./service";

/**
 * Base Widget class representing UI components
 * Widgets do not have behaviors but can subscribe to services
 */
export abstract class Widget {
  protected scene?: import("./scene").Scene;

  /**
   * Called once when the widget is fully constructed and references are available
   */
  protected onInit(): void {}

  /**
   * Called when the widget becomes active inside a scene
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

  _setScene(scene: import("./scene").Scene): void {
    this.scene = scene;
  }

  /**
   * Get a service instance from the current scene or game
   */
  protected getService<T extends Service>(serviceClass: new (...args: any[]) => T): T {
    if (!this.scene) throw new Error("Widget not attached to a scene");
    return this.scene.getService(serviceClass);
  }
}