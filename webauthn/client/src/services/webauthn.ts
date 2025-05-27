import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";

const API_URL = "http://localhost:5000";

export const webauthnService = {
  async register(username: string) {
    try {
      // Get registration options from server
      const optionsResponse = await fetch(`${API_URL}/auth/register/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!optionsResponse.ok) {
        throw new Error("Failed to get registration options");
      }

      const options: PublicKeyCredentialCreationOptionsJSON =
        await optionsResponse.json();

      // Start registration process
      const registrationResponse = await startRegistration({
        optionsJSON: options,
      });

      // Send registration response to server
      const verificationResponse = await fetch(
        `${API_URL}/auth/register/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            credential: registrationResponse,
          }),
        }
      );

      if (!verificationResponse.ok) {
        throw new Error("Registration failed");
      }

      return await verificationResponse.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async login(username: string) {
    try {
      // Get authentication options from server
      const optionsResponse = await fetch(`${API_URL}/auth/login/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!optionsResponse.ok) {
        throw new Error("Failed to get authentication options");
      }

      const options: PublicKeyCredentialRequestOptionsJSON =
        await optionsResponse.json();

      // Start authentication process
      const authenticationResponse = await startAuthentication({
        optionsJSON: options,
      });

      // Send authentication response to server
      const verificationResponse = await fetch(`${API_URL}/auth/login/finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          credential: authenticationResponse,
        }),
      });

      if (!verificationResponse.ok) {
        throw new Error("Authentication failed");
      }

      return await verificationResponse.json();
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  },
};
