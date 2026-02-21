import { Schema, model, models } from "mongoose";

const MemberSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    targetEmail: String,
    originalGuestEmail: { type: String, default: null },
    age: Number,
    isChild: Boolean,
    dietary: String,
    songSuggestion: String,
    role: String, // 'primary' | 'companion'
    token: String,
    accessLink: String,
    status: String, // 'sent', 'confirmed', etc.
    used: Boolean,
    sentAt: Date,
  },
  { _id: true } // tus docs ya traen _id en members, lo dejamos
);

const InvitationSchema = new Schema(
  {
    groupId: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    preferredLanguage: { type: String, default: "es" },
    notes: { type: String, default: "" },
    members: { type: [MemberSchema], default: [] },
  },
  {
    timestamps: true, // createdAt, updatedAt
    collection: "invitations",
  }
);

const Invitation =
  models.Invitation || model("Invitation", InvitationSchema);

export default Invitation;
