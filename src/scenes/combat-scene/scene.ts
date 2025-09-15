import { Scene } from "@engine";
import { CombatService } from "../../services/combat-service";
import { ProgressionService } from "../../services/progression-service";
import { Player } from "../../entities/player";
import { EnemyBasic } from "./entities/enemy-basic";
import { EnemyBoss } from "./entities/enemy-boss";
import { HUDCombat } from "./ui/hud-combat";
import { HealthBehavior } from "../../behaviors/health-behavior";

export class CombatScene extends Scene {
  private hudCombat!: HUDCombat;
  private player!: Player;
  private enemies: Array<EnemyBasic | EnemyBoss> = [];
  private isBossFight = false;

  constructor(isBossFight = false) {
    super("combat");
    this.isBossFight = isBossFight;
  }

  protected override onInit(): void {
    super.onInit();
    
    // Add scene-scoped services
    this.addService(new CombatService());
    
    // Add UI
    this.hudCombat = this.addWidget(new HUDCombat());
    
    // Add player
    this.player = this.addEntity(new Player());
    
    // Add enemies based on fight type
    if (this.isBossFight) {
      this.spawnBoss();
    } else {
      this.spawnBasicEnemies();
    }
    
    // Set up combat event listeners
    this.setupCombatEvents();
    
    console.log(`[CombatScene] Combat scene initialized (${this.isBossFight ? 'Boss Fight' : 'Normal Combat'})`);
  }

  private spawnBasicEnemies() {
    const enemyCount = 3 + Math.floor(Math.random() * 3); // 3-5 enemies
    
    for (let i = 0; i < enemyCount; i++) {
      const enemy = this.addEntity(new EnemyBasic(`enemy_${i}`));
      this.enemies.push(enemy);
    }
    
    this.hudCombat.setEnemyCount(this.enemies.length);
    console.log(`[CombatScene] Spawned ${enemyCount} basic enemies`);
  }

  private spawnBoss() {
    const boss = this.addEntity(new EnemyBoss());
    this.enemies.push(boss);
    this.hudCombat.showBossHealthBar(boss);
    console.log("[CombatScene] Spawned boss enemy");
  }

  private setupCombatEvents() {
    const combat = this.getService(CombatService);
    const progression = this.getService(ProgressionService);

    combat.entityDamaged.subscribe(({ entity }) => {
      // Check if an enemy died
      if (entity !== this.player) {
        const healthBehavior = entity.getBehavior(HealthBehavior);
        if (healthBehavior && !healthBehavior.isAlive) {
          this.onEnemyDefeated(entity);
        }
      }
      
      // Check if player died
      if (entity === this.player && !this.player.isAlive) {
        this.onPlayerDefeated();
      }
    });
  }

  private onEnemyDefeated(enemy: import("@engine").Entity) {
    // Remove from enemies array
    const index = this.enemies.findIndex(e => e === enemy);
    if (index >= 0) {
      this.enemies.splice(index, 1);
    }

    // Award experience
    const progression = this.getService(ProgressionService);
    const expReward = this.isBossFight ? 100 : 25;
    progression.gainExperience(expReward);

    console.log(`[CombatScene] Enemy ${enemy.id} defeated! Gained ${expReward} experience`);

    // Check for victory
    if (this.enemies.length === 0) {
      this.onVictory();
    } else {
      this.hudCombat.setEnemyCount(this.enemies.length);
    }
  }

  private onPlayerDefeated() {
    console.log("[CombatScene] Player defeated!");
    this.hudCombat.showDefeatScreen();
    
    // In a real implementation, this might trigger a game over screen
    // or respawn logic after a delay
  }

  private onVictory() {
    console.log("[CombatScene] Combat victory!");
    this.hudCombat.showVictoryScreen();
    
    if (this.isBossFight) {
      this.hudCombat.hideBossHealthBar();
    }
    
    // In a real implementation, this might transition to a victory scene
    // or return to the previous scene after a delay
  }

  simulatePlayerAttack() {
    // Simulate player attacking a random enemy for testing
    if (this.enemies.length > 0) {
      const combat = this.getService(CombatService);
      const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
      const damage = 15 + Math.floor(Math.random() * 10); // 15-25 damage
      combat.damageEntity(randomEnemy, damage);
    }
  }

  protected override onEnterScene(): void {
    super.onEnterScene();
    console.log("[CombatScene] Entered combat scene - battle begins!");
  }

  protected override onUpdate(dt: number): void {
    super.onUpdate(dt);
    
    // Combat scene specific update logic
    // Handle input, update combat state, etc.
  }

  protected override onExitScene(): void {
    super.onExitScene();
    console.log("[CombatScene] Exited combat scene");
  }

  protected override onDestroy(): void {
    super.onDestroy();
    console.log("[CombatScene] Combat scene destroyed");
  }
}