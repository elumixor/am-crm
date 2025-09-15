import { Entity } from "@engine";
import { DialogueService, DialogueData } from "../services/dialogue-service";

export class NPC extends Entity {
  private readonly name: string;
  private readonly dialogues: DialogueData[];

  constructor(id: string, name: string, dialogues: DialogueData[]) {
    super(id);
    this.name = name;
    this.dialogues = dialogues;
  }

  get npcName() {
    return this.name;
  }

  startDialogue() {
    if (this.dialogues.length > 0) {
      const dialogueService = this.getService(DialogueService);
      dialogueService.startDialogue(this.dialogues[0]);
    }
  }

  getDialogue(id: string): DialogueData | undefined {
    return this.dialogues.find(dialogue => dialogue.id === id);
  }

  protected override onInit() {
    super.onInit();
    console.log(`[NPC] ${this.name} (${this.id}) initialized`);
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log(`[NPC] ${this.name} entered scene`);
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // NPC-specific update logic
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log(`[NPC] ${this.name} exited scene`);
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log(`[NPC] ${this.name} destroyed`);
  }
}