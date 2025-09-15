import { Scene } from "@engine";
import { DialogueService } from "../../services/dialogue-service";
import { Vendor } from "./entities/vendor";
import { DialogueBox } from "./ui/dialogue-box";
import { Player } from "../../entities/player";

export class SafeZoneScene extends Scene {
  private dialogueBox!: DialogueBox;
  private player!: Player;
  private vendor!: Vendor;

  constructor() {
    super("safe-zone");
  }

  protected override onInit(): void {
    super.onInit();
    
    // Add scene-scoped services
    this.addService(new DialogueService());
    
    // Add UI
    this.dialogueBox = this.addWidget(new DialogueBox());
    
    // Add entities
    this.player = this.addEntity(new Player());
    this.vendor = this.addEntity(new Vendor("merchant_bob", "Bob the Merchant"));
    
    console.log("[SafeZoneScene] Safe zone scene initialized");
  }

  // Simulation methods for testing
  simulatePlayerTalkToVendor() {
    if (!this.dialogueBox.visible) {
      console.log("[SafeZoneScene] Player approaches vendor...");
      this.vendor.startTrade();
    }
  }

  simulateDialogueChoice(choiceIndex: number) {
    if (this.dialogueBox.visible) {
      this.dialogueBox.selectChoice(choiceIndex);
    }
  }

  simulatePurchase(itemId: string) {
    const playerGold = 300; // Mock player gold
    const result = this.vendor.sellItem(itemId, playerGold);
    
    if (result.success) {
      console.log(`[SafeZoneScene] Player purchased ${result.item?.name} for ${result.item?.price} gold`);
      console.log(`[SafeZoneScene] Player gold: ${playerGold} -> ${result.newGold}`);
    } else {
      console.log("[SafeZoneScene] Purchase failed - insufficient gold or item not found");
    }
  }

  protected override onEnterScene(): void {
    super.onEnterScene();
    console.log("[SafeZoneScene] Entered safe zone - players can rest, trade, and talk to NPCs");
  }

  protected override onUpdate(dt: number): void {
    super.onUpdate(dt);
    
    // Safe zone specific update logic
    // Handle peaceful interactions, dialogue, trading, etc.
  }

  protected override onExitScene(): void {
    super.onExitScene();
    console.log("[SafeZoneScene] Exited safe zone");
  }

  protected override onDestroy(): void {
    super.onDestroy();
    console.log("[SafeZoneScene] Safe zone scene destroyed");
  }
}