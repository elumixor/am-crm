import { Widget } from "@engine";
import { TimeService } from "../services/time-service";

export class PauseMenu extends Widget {
  private isVisible = false;

  show() {
    this.isVisible = true;
    console.log("[PauseMenu] Pause menu shown");
  }

  hide() {
    this.isVisible = false;
    console.log("[PauseMenu] Pause menu hidden");
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  get visible() {
    return this.isVisible;
  }

  resumeGame() {
    this.hide();
    // In a real implementation, this would unpause the game
    console.log("[PauseMenu] Game resumed");
  }

  saveGame() {
    // In a real implementation, this would trigger a save operation
    console.log("[PauseMenu] Game saved");
  }

  loadGame() {
    // In a real implementation, this would trigger a load operation
    console.log("[PauseMenu] Game loaded");
  }

  quitToMenu() {
    // In a real implementation, this would transition to the main menu scene
    console.log("[PauseMenu] Quit to main menu");
  }

  protected override onInit() {
    super.onInit();
    
    const timeService = this.getService(TimeService);
    timeService.timeChanged.subscribe(({ hours, minutes }) => {
      // Update any time display in the pause menu
      console.log(`[PauseMenu] Time updated: ${hours}:${minutes.toString().padStart(2, '0')}`);
    });

    console.log("[PauseMenu] Pause menu initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[PauseMenu] Pause menu available in scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    // Handle input for showing/hiding pause menu
    // In a real implementation, this would check for ESC key press or similar
    if (this.isVisible) {
      // Handle pause menu navigation
    }
  }

  protected override onExitScene() {
    super.onExitScene();
    this.hide();
    console.log("[PauseMenu] Pause menu exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[PauseMenu] Pause menu destroyed");
  }
}