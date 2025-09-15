import { Game } from "@engine";
import { TimeService } from "./services/time-service";
import { ProgressionService } from "./services/progression-service";
import { MenuScene } from "./scenes/menu-scene/scene";
import { CombatScene } from "./scenes/combat-scene/scene";

export class GameHypo extends Game {
  private menuScene!: MenuScene;
  private combatScene!: CombatScene;
  private bossCombatScene!: CombatScene;

  protected override onInit(): void {
    super.onInit();
    
    // Add global services
    this.addGlobalService(new TimeService());
    this.addGlobalService(new ProgressionService());
    
    // Register scenes
    this.menuScene = this.registerScene(new MenuScene());
    this.combatScene = this.registerScene(new CombatScene(false));
    this.bossCombatScene = this.registerScene(new CombatScene(true));
    
    // Start with menu scene
    this.setActiveScene(this.menuScene);
    
    console.log("[GameHypo] Game initialized with global services and scenes");
  }

  // Public methods for scene transitions
  startNewGame() {
    console.log("[GameHypo] Starting new game - transitioning to combat");
    this.setActiveScene(this.combatScene);
  }

  startBossFight() {
    console.log("[GameHypo] Starting boss fight - transitioning to boss combat");
    this.setActiveScene(this.bossCombatScene);
  }

  returnToMenu() {
    console.log("[GameHypo] Returning to main menu");
    this.setActiveScene(this.menuScene);
  }

  // Simulation methods for testing
  simulateCombat() {
    if (this.activeScene === this.combatScene) {
      (this.combatScene as CombatScene).simulatePlayerAttack();
    } else if (this.activeScene === this.bossCombatScene) {
      (this.bossCombatScene as CombatScene).simulatePlayerAttack();
    }
  }

  simulateMenuNavigation() {
    if (this.activeScene === this.menuScene) {
      this.menuScene.navigateDown();
    }
  }

  simulateMenuSelection() {
    if (this.activeScene === this.menuScene) {
      this.menuScene.activateSelection();
    }
  }

  get activeScene() {
    return this.scenes.find(scene => scene === this.getActiveScene());
  }

  private getActiveScene() {
    // Access the private activeScene through reflection
    // In a real implementation, this would be exposed properly
    return (this as any).activeScene;
  }

  protected override onStart(): void {
    super.onStart();
    console.log("[GameHypo] Game started - entering main loop");
  }

  protected override onUpdate(dt: number): void {
    super.onUpdate(dt);
    
    // Game-specific update logic
    // Handle global input, manage scene transitions, etc.
  }

  protected override onStop(): void {
    super.onStop();
    console.log("[GameHypo] Game stopped");
  }

  protected override onDestroy(): void {
    super.onDestroy();
    console.log("[GameHypo] Game destroyed and cleaned up");
  }
}