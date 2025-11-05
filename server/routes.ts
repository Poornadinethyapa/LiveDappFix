import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/.well-known/farcaster.json', (req, res) => {
    const manifest = {
      accountAssociation: {
        header: "",
        payload: "",
        signature: ""
      },
      miniapp: {
        version: "1",
        name: "Catch Items",
        homeUrl: "https://basexfruits.vercel.app",
        iconUrl: "https://basexfruits.vercel.app/favicon.png",
        splashImageUrl: "https://basexfruits.vercel.app/favicon.png",
        splashBackgroundColor: "#1a0b2e",
        subtitle: "Fast, fun catching game",
        description: "Catch falling items in this fast-paced Web3 game on the Base Network. Connect your wallet to compete on the leaderboard or play as a guest to try the game.",
        screenshotUrls: [],
        primaryCategory: "games",
        tags: ["game", "web3", "base", "blockchain", "casual"],
        heroImageUrl: "",
        tagline: "Catch and win!",
        ogTitle: "Catch Items - Web3 Game",
        ogDescription: "Play the Catch Items game on Base Network",
        ogImageUrl: "",
        noindex: false,
        requiredChains: ["eip155:8453"]
      }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(manifest);
  });

  const httpServer = createServer(app);

  return httpServer;
}
