import mongoose, { Document, Schema } from "mongoose";
import { AuthenticatorTransportFuture } from "@simplewebauthn/server";

export interface IAuthenticator {
  credentialID: Buffer;
  credentialPublicKey: Buffer;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
}

export interface IUser extends Document {
  username: string;
  currentChallenge?: string;
  authenticators: IAuthenticator[];
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  currentChallenge: {
    type: String,
  },
  authenticators: [
    {
      credentialID: {
        type: Buffer,
        required: true,
      },
      credentialPublicKey: {
        type: Buffer,
        required: true,
      },
      counter: {
        type: Number,
        required: true,
      },
      credentialDeviceType: {
        type: String,
        required: true,
      },
      credentialBackedUp: {
        type: Boolean,
        required: true,
      },
      transports: [
        {
          type: String,
          enum: ["ble", "internal", "nfc", "usb"],
        },
      ],
    },
  ],
});

export const User = mongoose.model<IUser>("User", UserSchema);
