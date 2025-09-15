import type { Scene } from "./scene";
import type { Service } from "./service";

/**
 * Base Game class - root controller that manages global services and active scenes
 */
export abstract class Game {
  readonly globalServices: Service[] = [];
  readonly scenes: Scene[] = [];
  
  private activeScene?: Scene;
  private lastTime = 0;
  private animationFrameId?: number;
  private running = false;

  /**
   * Add a global service available to all scenes
   */
  addGlobalService<T extends Service>(service: T): T {
    this.globalServices.push(service);
    service._init();
    return service;
  }

  /**
   * Remove a global service
   */
  removeGlobalService(service: Service): void {
    const index = this.globalServices.indexOf(service);
    if (index >= 0) {
      service._destroy();
      this.globalServices.splice(index, 1);
    }
  }

  /**
   * Register a scene with the game
   */
  registerScene<T extends Scene>(scene: T): T {
    this.scenes.push(scene);
    scene._setGame(this);
    scene._init();
    return scene;
  }

  /**
   * Unregister a scene from the game
   */
  unregisterScene(scene: Scene): void {
    // If this scene is active, deactivate it first
    if (this.activeScene === scene) {
      this.setActiveScene(undefined);
    }

    const index = this.scenes.indexOf(scene);
    if (index >= 0) {
      scene._destroy();
      this.scenes.splice(index, 1);
    }
  }

  /**
   * Set the active scene
   */
  setActiveScene(scene?: Scene): void {
    if (this.activeScene) {
      this.activeScene._exitScene();
    }

    this.activeScene = scene;

    if (this.activeScene) {
      this.activeScene._enterScene();
    }
  }

  /**
   * Get a scene by its ID
   */
  getScene(id: string): Scene | undefined {
    return this.scenes.find(scene => scene.id === id);
  }

  /**
   * Get a global service instance
   */
  getService<T extends Service>(serviceClass: new (...args: any[]) => T): T | undefined {
    return this.globalServices.find(service => service instanceof serviceClass) as T;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) return;
    
    this.running = true;
    this.lastTime = performance.now();
    this.onStart();
    this.gameLoop();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (!this.running) return;
    
    this.running = false;
    if (this.animationFrameId) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        // Browser environment
        cancelAnimationFrame(this.animationFrameId);
      } else {
        // Node.js environment
        clearTimeout(this.animationFrameId);
      }
      this.animationFrameId = undefined;
    }
    this.onStop();
  }

  /**
   * Game loop implementation
   */
  private gameLoop = (): void => {
    if (!this.running) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    // Update global services
    for (const service of this.globalServices) {
      service._update(deltaTime);
    }

    // Update active scene
    if (this.activeScene) {
      this.activeScene._update(deltaTime);
    }

    // Custom game update logic
    this.onUpdate(deltaTime);

    // Schedule next frame
    if (typeof requestAnimationFrame !== 'undefined') {
      // Browser environment
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    } else {
      // Node.js environment - use setTimeout
      this.animationFrameId = setTimeout(this.gameLoop, 1000 / 60) as any; // 60 FPS
    }
  };

  /**
   * Called once when the game is initialized
   */
  protected onInit(): void {}

  /**
   * Called when the game starts
   */
  protected onStart(): void {}

  /**
   * Called once per frame
   */
  protected onUpdate(dt: number): void {}

  /**
   * Called when the game stops
   */
  protected onStop(): void {}

  /**
   * Called for cleanup
   */
  protected onDestroy(): void {}

  /**
   * Initialize the game
   */
  init(): void {
    this.onInit();
  }

  /**
   * Destroy the game and clean up resources
   */
  destroy(): void {
    this.stop();
    
    // Clean up active scene
    if (this.activeScene) {
      this.activeScene._exitScene();
    }

    // Clean up all scenes
    for (const scene of this.scenes) {
      scene._destroy();
    }
    this.scenes.length = 0;

    // Clean up global services
    for (const service of this.globalServices) {
      service._destroy();
    }
    this.globalServices.length = 0;

    this.onDestroy();
  }
}