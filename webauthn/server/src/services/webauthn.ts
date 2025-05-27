import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import { User, IUser } from "../models/User";
import { Types } from "mongoose";

const rpName = "WebAuthn Demo";
const rpID = process.env.RP_ID || "localhost";
const origin = process.env.ORIGIN || `https://${rpID}`;

export class WebAuthnService {
  static async generateRegistrationOptions(username: string) {
    const user =
      (await User.findOne({ username })) || (await User.create({ username }));

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: Buffer.from((user._id as Types.ObjectId).toString()),
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        userVerification: "preferred",
        residentKey: "preferred",
      },
    });

    user.currentChallenge = options.challenge;
    await user.save();

    return options;
  }

  static async verifyRegistration(
    username: string,
    credential: RegistrationResponseJSON
  ) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const expectedChallenge = user.currentChallenge;
    if (!expectedChallenge) throw new Error("No challenge found");

    const verification = (await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    })) as VerifiedRegistrationResponse;

    if (verification.verified && verification.registrationInfo) {
      const { credentialPublicKey, credentialID, counter } =
        verification.registrationInfo;

      user.authenticators.push({
        credentialID: credential.id,
        credentialPublicKey,
        counter,
        credentialDeviceType: "singleDevice",
        credentialBackedUp: false,
      });

      user.currentChallenge = undefined;
      await user.save();
    }

    return verification.verified;
  }

  static async generateAuthenticationOptions(username: string) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.authenticators.map((authenticator) => ({
        id: authenticator.credentialID.toString("base64url"),
        type: "public-key",
        transports: authenticator.transports,
      })),
      userVerification: "preferred",
    });

    user.currentChallenge = options.challenge;
    await user.save();

    return options;
  }

  static async verifyAuthentication(
    username: string,
    credential: AuthenticationResponseJSON
  ) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const expectedChallenge = user.currentChallenge;
    if (!expectedChallenge) throw new Error("No challenge found");

    const authenticator = user.authenticators.find(
      (auth) => auth.credentialID.toString("base64url") === credential.id
    );
    if (!authenticator) throw new Error("Authenticator not found");

    const verification = (await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialPublicKey: authenticator.credentialPublicKey,
        credentialID: authenticator.credentialID,
        counter: authenticator.counter,
      },
    })) as VerifiedAuthenticationResponse;

    if (verification.verified) {
      authenticator.counter = verification.authenticationInfo.newCounter;
      user.currentChallenge = undefined;
      await user.save();
    }

    return verification.verified;
  }
}
