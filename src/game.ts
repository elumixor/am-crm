import { Game } from "@engine";
import { TimeService } from "./services/time-service";
import { ProgressionService } from "./services/progression-service";
import { MenuScene } from "./scenes/menu-scene/scene";
import { CombatScene } from "./scenes/combat-scene/scene";
import { SafeZoneScene } from "./scenes/safe-zone-scene/scene";
import { SkillTree } from "./ui/skill-tree";
import { ResourceManager } from "./resources";

export class GameHypo extends Game {
  private menuScene!: MenuScene;
  private combatScene!: CombatScene;
  private bossCombatScene!: CombatScene;
  private safeZoneScene!: SafeZoneScene;
  private skillTree!: SkillTree;
  private resourceManager!: ResourceManager;

  protected override onInit(): void {
    super.onInit();
    
    // Initialize resource manager
    this.resourceManager = new ResourceManager();
    
    // Add global services
    this.addGlobalService(new TimeService());
    this.addGlobalService(new ProgressionService());
    
    // Register scenes
    this.menuScene = this.registerScene(new MenuScene());
    this.combatScene = this.registerScene(new CombatScene(false));
    this.bossCombatScene = this.registerScene(new CombatScene(true));
    this.safeZoneScene = this.registerScene(new SafeZoneScene());
    
    // Start with menu scene
    this.setActiveScene(this.menuScene);
    
    console.log("[GameHypo] Game initialized with global services and scenes");
  }

  /**
   * Preload game assets
   */
  async preloadAssets(): Promise<void> {
    console.log("[GameHypo] Preloading game assets...");
    await this.resourceManager.preloadAll();
    console.log("[GameHypo] Asset preloading completed");
  }

  /**
   * Get loading progress
   */
  getLoadingProgress(): number {
    return this.resourceManager.getLoadingProgress();
  }

  // Public methods for scene transitions
  startNewGame() {
    console.log("[GameHypo] Starting new game - transitioning to safe zone");
    this.setActiveScene(this.safeZoneScene);
  }

  enterCombat() {
    console.log("[GameHypo] Entering combat - transitioning to combat scene");
    this.setActiveScene(this.combatScene);
  }

  startBossFight() {
    console.log("[GameHypo] Starting boss fight - transitioning to boss combat");
    this.setActiveScene(this.bossCombatScene);
  }

  returnToSafeZone() {
    console.log("[GameHypo] Returning to safe zone");
    this.setActiveScene(this.safeZoneScene);
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

  simulateVendorInteraction() {
    if (this.activeScene === this.safeZoneScene) {
      (this.safeZoneScene as SafeZoneScene).simulatePlayerTalkToVendor();
    }
  }

  simulateDialogueChoice(choiceIndex: number) {
    if (this.activeScene === this.safeZoneScene) {
      (this.safeZoneScene as SafeZoneScene).simulateDialogueChoice(choiceIndex);
    }
  }

  simulatePurchase(itemId: string) {
    if (this.activeScene === this.safeZoneScene) {
      (this.safeZoneScene as SafeZoneScene).simulatePurchase(itemId);
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
    if (this.resourceManager) {
      this.resourceManager.dispose();
    }
    console.log("[GameHypo] Game destroyed and cleaned up");
  }
}