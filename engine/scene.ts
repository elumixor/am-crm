import type { Entity } from "./entity";
import type { Service } from "./service";
import type { Widget } from "./widget";

/**
 * Base Scene class that manages entities, widgets, and scene-scoped services
 */
export abstract class Scene {
  readonly id: string;
  readonly entities: Entity[] = [];
  readonly widgets: Widget[] = [];
  readonly services: Service[] = [];
  
  protected game?: import("./game").Game;

  constructor(id: string) {
    this.id = id;
  }

  /**
   * Add an entity to this scene
   */
  addEntity<T extends Entity>(entity: T): T {
    this.entities.push(entity);
    entity._setScene(this);
    entity._init();
    entity._enterScene();
    return entity;
  }

  /**
   * Remove an entity from this scene
   */
  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index >= 0) {
      entity._exitScene();
      entity._destroy();
      this.entities.splice(index, 1);
    }
  }

  /**
   * Add a widget to this scene
   */
  addWidget<T extends Widget>(widget: T): T {
    this.widgets.push(widget);
    widget._setScene(this);
    widget._init();
    widget._enterScene();
    return widget;
  }

  /**
   * Remove a widget from this scene
   */
  removeWidget(widget: Widget): void {
    const index = this.widgets.indexOf(widget);
    if (index >= 0) {
      widget._exitScene();
      widget._destroy();
      this.widgets.splice(index, 1);
    }
  }

  /**
   * Add a service to this scene
   */
  addService<T extends Service>(service: T): T {
    this.services.push(service);
    service._setScene(this);
    service._init();
    service._enterScene();
    return service;
  }

  /**
   * Remove a service from this scene
   */
  removeService(service: Service): void {
    const index = this.services.indexOf(service);
    if (index >= 0) {
      service._exitScene();
      service._destroy();
      this.services.splice(index, 1);
    }
  }

  /**
   * Get a service instance from this scene or the global game
   */
  getService<T extends Service>(serviceClass: new (...args: any[]) => T): T {
    // First check scene-scoped services
    const sceneService = this.services.find(service => service instanceof serviceClass) as T;
    if (sceneService) return sceneService;

    // Then check global game services
    if (this.game) {
      const globalService = this.game.getService(serviceClass);
      if (globalService) return globalService;
    }

    throw new Error(`Service ${serviceClass.name} not found`);
  }

  /**
   * Called once when the scene is fully constructed and references are available
   */
  protected onInit(): void {}

  /**
   * Called when the scene becomes active
   */
  protected onEnterScene(): void {}

  /**
   * Called once per frame
   */
  protected onUpdate(dt: number): void {}

  /**
   * Called when the scene is deactivated
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
    // Update services first
    for (const service of this.services) {
      service._update(dt);
    }
    
    // Then entities
    for (const entity of this.entities) {
      entity._update(dt);
    }
    
    // Then widgets
    for (const widget of this.widgets) {
      widget._update(dt);
    }
    
    // Finally the scene itself
    this.onUpdate(dt);
  }

  _exitScene(): void {
    // Exit in reverse order
    this.onExitScene();
    
    for (const widget of this.widgets) {
      widget._exitScene();
    }
    
    for (const entity of this.entities) {
      entity._exitScene();
    }
    
    for (const service of this.services) {
      service._exitScene();
    }
  }

  _destroy(): void {
    // Destroy all managed objects
    for (const widget of this.widgets) {
      widget._destroy();
    }
    this.widgets.length = 0;
    
    for (const entity of this.entities) {
      entity._destroy();
    }
    this.entities.length = 0;
    
    for (const service of this.services) {
      service._destroy();
    }
    this.services.length = 0;
    
    this.onDestroy();
  }

  _setGame(game: import("./game").Game): void {
    this.game = game;
  }
}