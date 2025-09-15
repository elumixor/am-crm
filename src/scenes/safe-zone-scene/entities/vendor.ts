import { Entity } from "@engine";
import { DialogueService } from "../../../services/dialogue-service";

export class Vendor extends Entity {
  private readonly vendorName: string;
  private readonly inventory: Array<{ id: string; name: string; price: number }>;

  constructor(id: string, name: string) {
    super(id);
    this.vendorName = name;
    this.inventory = [
      { id: "health_potion", name: "Health Potion", price: 50 },
      { id: "mana_potion", name: "Mana Potion", price: 30 },
      { id: "sword", name: "Iron Sword", price: 200 },
      { id: "shield", name: "Wooden Shield", price: 100 },
    ];
  }

  get name() {
    return this.vendorName;
  }

  get items() {
    return [...this.inventory];
  }

  startTrade() {
    const dialogueService = this.getService(DialogueService);
    dialogueService.startDialogue({
      id: "vendor_greeting",
      text: `Welcome to my shop! I'm ${this.vendorName}. What can I get for you today?`,
      speaker: this.vendorName,
      choices: [
        { text: "Show me your wares", nextId: "vendor_shop" },
        { text: "Not interested", nextId: "vendor_goodbye" }
      ]
    });
  }

  sellItem(itemId: string, playerGold: number): { success: boolean; item?: any; newGold?: number } {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) {
      return { success: false };
    }

    if (playerGold < item.price) {
      return { success: false };
    }

    return {
      success: true,
      item: { ...item },
      newGold: playerGold - item.price
    };
  }

  protected override onInit() {
    super.onInit();
    console.log(`[Vendor] ${this.vendorName} (${this.id}) initialized with ${this.inventory.length} items`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[Vendor] ${this.vendorName} is now available for trading`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Vendor-specific update logic (restocking, price changes, etc.)
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[Vendor] ${this.vendorName} is no longer available`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[Vendor] ${this.vendorName} destroyed`);
  }
}