import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  const conn = await mongoose.connect(uri);
  console.log("✅ Conectado a MongoDB:", conn.connection.name); // <- ahora sí funciona
  return conn;
};
