import { Service, Entity } from "@engine";
import { EventEmitter } from "@elumixor/frontils";

export class CombatService extends Service {
  readonly entityDamaged = new EventEmitter<{ entity: Entity; amount: number }>();

  damageEntity(entity: Entity, amount: number) {
    this.entityDamaged.emit({ entity, amount });
  }

  protected override onInit() {
    super.onInit();
    console.log("[CombatService] Initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[CombatService] Entered scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    // Combat system update logic
  }

  protected override onExitScene() {
    super.onExitScene();
    console.log("[CombatService] Exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[CombatService] Destroyed");
  }
}