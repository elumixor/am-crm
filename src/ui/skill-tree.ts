import { Widget } from "@engine";
import { ProgressionService } from "../services/progression-service";

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  requirements: string[];
  unlocked: boolean;
  learned: boolean;
}

export class SkillTree extends Widget {
  private isVisible = false;
  private skills: SkillNode[] = [
    {
      id: "basic_attack",
      name: "Basic Attack",
      description: "Improves basic attack damage by 10%",
      cost: 1,
      requirements: [],
      unlocked: true,
      learned: false
    },
    {
      id: "health_boost",
      name: "Health Boost",
      description: "Increases maximum health by 25",
      cost: 1,
      requirements: [],
      unlocked: true,
      learned: false
    },
    {
      id: "power_strike",
      name: "Power Strike",
      description: "Unlocks a powerful special attack",
      cost: 2,
      requirements: ["basic_attack"],
      unlocked: false,
      learned: false
    },
    {
      id: "vitality",
      name: "Vitality",
      description: "Increases health regeneration",
      cost: 2,
      requirements: ["health_boost"],
      unlocked: false,
      learned: false
    },
    {
      id: "berserker_rage",
      name: "Berserker Rage",
      description: "Temporary damage boost when health is low",
      cost: 3,
      requirements: ["power_strike", "vitality"],
      unlocked: false,
      learned: false
    }
  ];

  private availableSkillPoints = 0;

  show() {
    this.isVisible = true;
    console.log("[SkillTree] Skill tree opened");
    this.displaySkillTree();
  }

  hide() {
    this.isVisible = false;
    console.log("[SkillTree] Skill tree closed");
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

  get availablePoints() {
    return this.availableSkillPoints;
  }

  learnSkill(skillId: string): boolean {
    const skill = this.skills.find(s => s.id === skillId);
    if (!skill) {
      console.log(`[SkillTree] Skill not found: ${skillId}`);
      return false;
    }

    if (skill.learned) {
      console.log(`[SkillTree] Skill already learned: ${skill.name}`);
      return false;
    }

    if (!skill.unlocked) {
      console.log(`[SkillTree] Skill not unlocked: ${skill.name}`);
      return false;
    }

    if (this.availableSkillPoints < skill.cost) {
      console.log(`[SkillTree] Insufficient skill points for ${skill.name} (need ${skill.cost}, have ${this.availableSkillPoints})`);
      return false;
    }

    // Learn the skill
    skill.learned = true;
    this.availableSkillPoints -= skill.cost;
    console.log(`[SkillTree] Learned skill: ${skill.name} (-${skill.cost} skill points)`);

    // Unlock dependent skills
    this.updateUnlockedSkills();

    return true;
  }

  private updateUnlockedSkills() {
    for (const skill of this.skills) {
      if (!skill.unlocked && !skill.learned) {
        const requirementsMet = skill.requirements.every(req => 
          this.skills.find(s => s.id === req)?.learned
        );
        if (requirementsMet) {
          skill.unlocked = true;
          console.log(`[SkillTree] Unlocked skill: ${skill.name}`);
        }
      }
    }
  }

  private displaySkillTree() {
    console.log(`[SkillTree] === SKILL TREE (${this.availableSkillPoints} points available) ===`);
    for (const skill of this.skills) {
      const status = skill.learned ? "LEARNED" : 
                    skill.unlocked ? `AVAILABLE (${skill.cost} pts)` : 
                    "LOCKED";
      const requirements = skill.requirements.length > 0 ? 
                          ` [Requires: ${skill.requirements.join(", ")}]` : "";
      console.log(`[SkillTree] ${skill.name}: ${skill.description} - ${status}${requirements}`);
    }
  }

  protected override onInit() {
    super.onInit();
    
    const progression = this.getService(ProgressionService);
    
    progression.levelUp.subscribe(({ newLevel }) => {
      // Award skill points on level up
      const pointsGained = newLevel === 2 ? 1 : 2; // First level gives 1 point, subsequent give 2
      this.availableSkillPoints += pointsGained;
      console.log(`[SkillTree] Gained ${pointsGained} skill points from reaching level ${newLevel}`);
    });

    // Start with 1 skill point
    this.availableSkillPoints = 1;
    this.updateUnlockedSkills();

    console.log("[SkillTree] Skill tree initialized");
  }

  protected override onEnterScene() {
    super.onEnterScene();
    console.log("[SkillTree] Skill tree available in scene");
  }

  protected override onUpdate(dt: number) {
    super.onUpdate(dt);
    
    if (this.isVisible) {
      // Handle skill tree input and animations
    }
  }

  protected override onExitScene() {
    super.onExitScene();
    this.hide();
    console.log("[SkillTree] Skill tree exited scene");
  }

  protected override onDestroy() {
    super.onDestroy();
    console.log("[SkillTree] Skill tree destroyed");
  }
}