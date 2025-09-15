import { Widget } from "@engine";
import { DialogueService } from "../../../services/dialogue-service";

export class DialogueBox extends Widget {
  private isVisible = false;
  private currentDialogue?: import("../../../services/dialogue-service").DialogueData;

  show() {
    this.isVisible = true;
    console.log("[DialogueBox] Dialogue box shown");
  }

  hide() {
    this.isVisible = false;
    this.currentDialogue = undefined;
    console.log("[DialogueBox] Dialogue box hidden");
  }

  get visible() {
    return this.isVisible;
  }

  get dialogue() {
    return this.currentDialogue;
  }

  selectChoice(choiceIndex: number) {
    if (!this.currentDialogue?.choices || choiceIndex < 0 || choiceIndex >= this.currentDialogue.choices.length) {
      return;
    }

    const choice = this.currentDialogue.choices[choiceIndex];
    console.log(`[DialogueBox] Choice selected: "${choice.text}"`);

    const dialogueService = this.getService(DialogueService);
    dialogueService.selectChoice(choice.text, choice.nextId);

    // Handle next dialogue or end
    if (choice.nextId === "end" || choice.nextId === "vendor_goodbye") {
      this.hide();
      dialogueService.endDialogue();
    } else {
      // In a real implementation, this would load the next dialogue
      console.log(`[DialogueBox] Next dialogue: ${choice.nextId}`);
    }
  }

  protected override onInit() {
    super.onInit();
    
    const dialogueService = this.getService(DialogueService);
    
    dialogueService.dialogueStarted.subscribe(({ dialogue }) => {
      this.currentDialogue = dialogue;
      this.show();
      this.displayDialogue(dialogue);
    });

    dialogueService.dialogueEnded.subscribe(() => {
      this.hide();
    });

    console.log("[DialogueBox] Dialogue box initialized");
  }

  private displayDialogue(dialogue: import("../../../services/dialogue-service").DialogueData) {
    console.log(`[DialogueBox] ${dialogue.speaker}: "${dialogue.text}"`);
    
    if (dialogue.choices) {
      console.log("[DialogueBox] Choices:");
      dialogue.choices.forEach((choice, index) => {
        console.log(`[DialogueBox]   ${index + 1}. ${choice.text}`);
      });
    } else {
      console.log("[DialogueBox] Press any key to continue...");
    }
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[DialogueBox] Dialogue box available in scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    if (this.isVisible && this.currentDialogue) {
      // Handle dialogue input, animations, etc.
      // In a real implementation, this would handle keyboard/mouse input for dialogue choices
    }
  }

  protected override onExitScene() {
    super.onExitScene();
    this.hide();
    console.log("[DialogueBox] Dialogue box exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[DialogueBox] Dialogue box destroyed");
  }
}