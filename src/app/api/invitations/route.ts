// src/app/api/invitations/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Invitation from "@/models/Invitacion";
import { Types } from "mongoose";

// Para resultados .lean(): objetos planos
type MemberLean = Record<string, unknown> & { _id?: Types.ObjectId | string };
type InvitationLean = Record<string, unknown> & {
  _id: Types.ObjectId | string;
  members?: MemberLean[];
};

function toIdString(id: unknown): string {
  if (typeof id === "string") return id;
  if (id instanceof Types.ObjectId) return id.toString();
  if (id && typeof id === "object" && "toString" in id) {
    const maybe = (id as { toString?: unknown }).toString;
    if (typeof maybe === "function") return maybe.call(id) as string;
  }
  return String(id);
}

export async function GET() {
  try {
    await connectDB();

    const invitations = (await Invitation.find()
      .sort({ createdAt: -1 })
      .lean()) as InvitationLean[];

    const normalized = invitations.map((inv) => ({
      ...inv,
      _id: toIdString(inv._id),
      members: (inv.members ?? []).map((m) => ({
        ...m,
        _id: m._id ? toIdString(m._id) : undefined,
      })),
    }));

    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    console.error("[GET /api/invitations] error", error);
    return NextResponse.json(
      { message: "Error fetching invitations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as Record<string, unknown>;
    const created = (await Invitation.create(body)) as { _id: Types.ObjectId | string };

    return NextResponse.json(
      { _id: toIdString(created._id) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/invitations] error", error);
    return NextResponse.json(
      { message: "Error creating invitation" },
      { status: 500 }
    );
  }
}