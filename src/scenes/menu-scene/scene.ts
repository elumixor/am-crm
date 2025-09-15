import { Scene } from "@engine";
import { MainMenu } from "./ui/main-menu";

export class MenuScene extends Scene {
  private mainMenu!: MainMenu;

  constructor() {
    super("menu");
  }

  protected override onInit(): void {
    super.onInit();
    
    // Add UI
    this.mainMenu = this.addWidget(new MainMenu());
    
    console.log("[MenuScene] Menu scene initialized");
  }

  navigateUp() {
    const currentSelection = this.mainMenu.currentSelection;
    const newSelection = currentSelection === 0 ? this.mainMenu.menuOptions.length - 1 : currentSelection - 1;
    this.mainMenu.selectOption(newSelection);
  }

  navigateDown() {
    const currentSelection = this.mainMenu.currentSelection;
    const newSelection = (currentSelection + 1) % this.mainMenu.menuOptions.length;
    this.mainMenu.selectOption(newSelection);
  }

  activateSelection() {
    this.mainMenu.activateSelectedOption();
  }

  protected override onEnterScene(): void {
    super.onEnterScene();
    console.log("[MenuScene] Entered menu scene");
  }

  protected override onUpdate(dt: number): void {
    super.onUpdate(dt);
    
    // Menu scene specific update logic
    // Handle input for menu navigation
  }

  protected override onExitScene(): void {
    super.onExitScene();
    console.log("[MenuScene] Exited menu scene");
  }

  protected override onDestroy(): void {
    super.onDestroy();
    console.log("[MenuScene] Menu scene destroyed");
  }
}