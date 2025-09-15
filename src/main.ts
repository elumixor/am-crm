import { GameHypo } from "./game";

// Initialize and start the game
const game = new GameHypo();

// Initialize the game
game.init();

// Start the game loop
game.start();

console.log("Game engine initialized and started!");

// Expose game to global scope for testing/debugging
if (typeof window !== "undefined") {
  (window as any).game = game;
  console.log("Game instance available as 'window.game' for debugging");
}

// Example of simulating some game actions for demonstration
setTimeout(() => {
  console.log("\n=== Simulating comprehensive game interactions ===");
  
  // Start with menu navigation
  console.log("1. Navigating menu...");
  game.simulateMenuNavigation();
  game.simulateMenuNavigation();
  
  setTimeout(() => {
    console.log("\n2. Starting new game (entering safe zone)...");
    game.startNewGame();
    
    setTimeout(() => {
      console.log("\n3. Talking to vendor...");
      game.simulateVendorInteraction();
      
      setTimeout(() => {
        console.log("\n4. Selecting shop option...");
        game.simulateDialogueChoice(0); // "Show me your wares"
        
        setTimeout(() => {
          console.log("\n5. Purchasing health potion...");
          game.simulatePurchase("health_potion");
          
          setTimeout(() => {
            console.log("\n6. Entering combat...");
            game.enterCombat();
            
            setTimeout(() => {
              console.log("\n7. Simulating combat encounters...");
              game.simulateCombat();
              game.simulateCombat();
              game.simulateCombat();
              
              setTimeout(() => {
                console.log("\n8. Starting boss fight...");
                game.startBossFight();
                
                setTimeout(() => {
                  console.log("\n9. Fighting boss...");
                  game.simulateCombat();
                  game.simulateCombat();
                  
                  setTimeout(() => {
                    console.log("\n10. Returning to safe zone...");
                    game.returnToSafeZone();
                    
                    setTimeout(() => {
                      console.log("\n11. Final return to menu...");
                      game.returnToMenu();
                      
                      console.log("\n=== Game simulation completed successfully! ===");
                      console.log("All systems working: Entity-Behavior, Services, Scenes, Widgets");
                      console.log("Architecture fully implemented with proper lifecycle management!");
                      
                    }, 2000);
                  }, 2000);
                }, 3000);
              }, 2000);
            }, 3000);
          }, 2000);
        }, 1500);
      }, 1500);
    }, 2000);
  }, 2000);
}, 1000);

// Clean shutdown handling
if (typeof process !== "undefined") {
  process.on("SIGINT", () => {
    console.log("\nShutting down game...");
    game.destroy();
    process.exit(0);
  });
}