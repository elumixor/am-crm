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
  console.log("\n=== Simulating game interactions ===");
  
  // Simulate menu navigation
  console.log("Navigating menu...");
  game.simulateMenuNavigation();
  game.simulateMenuNavigation();
  
  // Start a new game
  setTimeout(() => {
    console.log("Starting new game...");
    game.startNewGame();
    
    // Simulate some combat
    setTimeout(() => {
      console.log("Simulating combat...");
      game.simulateCombat();
      game.simulateCombat();
      game.simulateCombat();
      
      // Start boss fight
      setTimeout(() => {
        console.log("Starting boss fight...");
        game.startBossFight();
        
        // Simulate boss combat
        setTimeout(() => {
          console.log("Fighting boss...");
          game.simulateCombat();
          game.simulateCombat();
          
          // Return to menu
          setTimeout(() => {
            console.log("Returning to menu...");
            game.returnToMenu();
          }, 2000);
          
        }, 2000);
      }, 3000);
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