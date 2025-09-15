import { Widget } from "@engine";

export class MainMenu extends Widget {
  private selectedOption = 0;
  private readonly options = [
    "Start New Game",
    "Load Game", 
    "Settings",
    "Exit"
  ];

  selectOption(index: number) {
    if (index >= 0 && index < this.options.length) {
      this.selectedOption = index;
      console.log(`[MainMenu] Selected: ${this.options[index]}`);
    }
  }

  activateSelectedOption() {
    const option = this.options[this.selectedOption];
    console.log(`[MainMenu] Activated: ${option}`);

    switch (this.selectedOption) {
      case 0: // Start New Game
        this.startNewGame();
        break;
      case 1: // Load Game
        this.loadGame();
        break;
      case 2: // Settings
        this.openSettings();
        break;
      case 3: // Exit
        this.exitGame();
        break;
    }
  }

  private startNewGame() {
    console.log("[MainMenu] Starting new game...");
    // In a real implementation, this would trigger scene transition
  }

  private loadGame() {
    console.log("[MainMenu] Loading saved game...");
    // In a real implementation, this would show load game UI
  }

  private openSettings() {
    console.log("[MainMenu] Opening settings...");
    // In a real implementation, this would show settings UI
  }

  private exitGame() {
    console.log("[MainMenu] Exiting game...");
    // In a real implementation, this would quit the application
  }

  get currentSelection() {
    return this.selectedOption;
  }

  get menuOptions() {
    return [...this.options];
  }

  protected override onInit() {
    super.onInit();
    console.log("[MainMenu] Main menu initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[MainMenu] Main menu is now active");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    // Handle menu navigation input
    // In a real implementation, this would check for arrow keys, enter, etc.
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[MainMenu] Main menu hidden");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[MainMenu] Main menu destroyed");
  }
}