import { Service } from "@engine";
import { EventEmitter } from "@elumixor/frontils";

export interface DialogueData {
  id: string;
  text: string;
  speaker: string;
  choices?: Array<{ text: string; nextId: string }>;
}

export class DialogueService extends Service {
  readonly dialogueStarted = new EventEmitter<{ dialogue: DialogueData }>();
  readonly dialogueEnded = new EventEmitter<void>();
  readonly choiceSelected = new EventEmitter<{ choice: string; nextId: string }>();

  private currentDialogue?: DialogueData;

  startDialogue(dialogue: DialogueData) {
    this.currentDialogue = dialogue;
    this.dialogueStarted.emit({ dialogue });
  }

  endDialogue() {
    this.currentDialogue = undefined;
    this.dialogueEnded.emit();
  }

  selectChoice(choice: string, nextId: string) {
    this.choiceSelected.emit({ choice, nextId });
  }

  get isInDialogue() {
    return this.currentDialogue !== undefined;
  }

  protected override onInit() {
    super.onInit();
    console.log("[DialogueService] Initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[DialogueService] Entered scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Dialogue system update logic
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[DialogueService] Exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[DialogueService] Destroyed");
  }
}