import { Router, Request, Response } from "express";
import { WebAuthnService } from "../services/webauthn";

const router = Router();

// Generate registration options
router.post("/register/start", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const options = await WebAuthnService.generateRegistrationOptions(username);
    res.json(options);
  } catch (error) {
    console.error("Registration options error:", error);
    res.status(500).json({ error: "Failed to generate registration options" });
  }
});

// Verify registration
router.post("/register/verify", async (req: Request, res: Response) => {
  try {
    const { username, credential } = req.body;
    if (!username || !credential) {
      return res
        .status(400)
        .json({ error: "Username and credential are required" });
    }

    const verified = await WebAuthnService.verifyRegistration(
      username,
      credential
    );
    res.json({ verified });
  } catch (error) {
    console.error("Registration verification error:", error);
    res.status(500).json({ error: "Failed to verify registration" });
  }
});

// Generate authentication options
router.post("/login/start", async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const options = await WebAuthnService.generateAuthenticationOptions(
      username
    );
    res.json(options);
  } catch (error) {
    console.error("Authentication options error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate authentication options" });
  }
});

// Verify authentication
router.post("/login/verify", async (req: Request, res: Response) => {
  try {
    const { username, credential } = req.body;
    if (!username || !credential) {
      return res
        .status(400)
        .json({ error: "Username and credential are required" });
    }

    const verified = await WebAuthnService.verifyAuthentication(
      username,
      credential
    );
    res.json({ verified });
  } catch (error) {
    console.error("Authentication verification error:", error);
    res.status(500).json({ error: "Failed to verify authentication" });
  }
});

export default router;
