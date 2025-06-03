import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["admin", "invitado"], default: "invitado" },
}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;
