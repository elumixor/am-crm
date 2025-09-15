/**
 * Resource management for the game
 * Defines asset manifest and preload logic
 */

export interface AssetManifest {
  models: Record<string, string>;
  sprites: Record<string, string>;
  sounds: Record<string, string>;
}

export const ASSET_MANIFEST: AssetManifest = {
  models: {
    player: "/assets/models/player.gltf",
    enemy_basic: "/assets/models/enemy_basic.gltf",
    enemy_boss: "/assets/models/boss.gltf",
    vendor: "/assets/models/npc_vendor.gltf",
    sword: "/assets/models/weapons/sword.gltf",
    shield: "/assets/models/weapons/shield.gltf",
  },
  sprites: {
    ui_background: "/assets/sprites/ui/background.png",
    health_bar: "/assets/sprites/ui/health_bar.png",
    experience_bar: "/assets/sprites/ui/exp_bar.png",
    menu_button: "/assets/sprites/ui/menu_button.png",
    skill_tree_bg: "/assets/sprites/ui/skill_tree_background.png",
    dialogue_box: "/assets/sprites/ui/dialogue_box.png",
    player_portrait: "/assets/sprites/portraits/player.png",
    vendor_portrait: "/assets/sprites/portraits/vendor.png",
    item_health_potion: "/assets/sprites/items/health_potion.png",
    item_mana_potion: "/assets/sprites/items/mana_potion.png",
  },
  sounds: {
    bgm_menu: "/assets/sounds/music/menu_theme.ogg",
    bgm_combat: "/assets/sounds/music/combat_theme.ogg",
    bgm_safe_zone: "/assets/sounds/music/peaceful_theme.ogg",
    sfx_attack: "/assets/sounds/effects/sword_hit.wav",
    sfx_enemy_death: "/assets/sounds/effects/enemy_death.wav",
    sfx_level_up: "/assets/sounds/effects/level_up.wav",
    sfx_menu_select: "/assets/sounds/effects/menu_select.wav",
    sfx_dialogue_start: "/assets/sounds/effects/dialogue_start.wav",
    sfx_skill_learn: "/assets/sounds/effects/skill_learned.wav",
    sfx_purchase: "/assets/sounds/effects/coin_purchase.wav",
  },
};

export class ResourceManager {
  private loadedAssets = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  /**
   * Preload all assets defined in the manifest
   */
  async preloadAll(): Promise<void> {
    console.log("[ResourceManager] Starting asset preload...");
    
    const allAssets = [
      ...Object.entries(ASSET_MANIFEST.models),
      ...Object.entries(ASSET_MANIFEST.sprites),
      ...Object.entries(ASSET_MANIFEST.sounds),
    ];

    const loadPromises = allAssets.map(([key, path]) => this.loadAsset(key, path));
    
    try {
      await Promise.all(loadPromises);
      console.log(`[ResourceManager] Successfully preloaded ${allAssets.length} assets`);
    } catch (error) {
      console.error("[ResourceManager] Failed to preload some assets:", error);
    }
  }

  /**
   * Load a specific asset
   */
  async loadAsset(key: string, path: string): Promise<any> {
    if (this.loadedAssets.has(key)) {
      return this.loadedAssets.get(key);
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const loadPromise = this.loadAssetFromPath(path);
    this.loadingPromises.set(key, loadPromise);

    try {
      const asset = await loadPromise;
      this.loadedAssets.set(key, asset);
      this.loadingPromises.delete(key);
      console.log(`[ResourceManager] Loaded asset: ${key}`);
      return asset;
    } catch (error) {
      this.loadingPromises.delete(key);
      console.error(`[ResourceManager] Failed to load asset ${key} from ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get a loaded asset
   */
  getAsset(key: string): any {
    return this.loadedAssets.get(key);
  }

  /**
   * Check if an asset is loaded
   */
  isLoaded(key: string): boolean {
    return this.loadedAssets.has(key);
  }

  /**
   * Get loading progress as percentage
   */
  getLoadingProgress(): number {
    const totalAssets = Object.keys(ASSET_MANIFEST.models).length +
                       Object.keys(ASSET_MANIFEST.sprites).length +
                       Object.keys(ASSET_MANIFEST.sounds).length;
    
    const loadedCount = this.loadedAssets.size;
    return totalAssets > 0 ? (loadedCount / totalAssets) * 100 : 100;
  }

  /**
   * Load asset from file path (mock implementation)
   */
  private async loadAssetFromPath(path: string): Promise<any> {
    // In a real implementation, this would load the actual asset
    // For now, we'll simulate loading with a delay and return a mock asset
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50)); // 50-150ms delay
    
    const extension = path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'gltf':
      case 'glb':
        return { type: 'model', path, loaded: true };
      case 'png':
      case 'jpg':
      case 'jpeg':
        return { type: 'sprite', path, loaded: true };
      case 'ogg':
      case 'wav':
      case 'mp3':
        return { type: 'sound', path, loaded: true };
      default:
        return { type: 'unknown', path, loaded: true };
    }
  }

  /**
   * Dispose of all loaded assets
   */
  dispose(): void {
    console.log(`[ResourceManager] Disposing ${this.loadedAssets.size} loaded assets`);
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}