// src/app/api/invitations/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Invitation from "@/models/Invitacion";
import { isValidObjectId, Types } from "mongoose";

type RouteParams = { id: string };

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const invitation = (await Invitation.findById(id).lean()) as
      | InvitationLean
      | null;

    if (!invitation) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...invitation,
        _id: toIdString(invitation._id),
        members: (invitation.members ?? []).map((m) => ({
          ...m,
          _id: m._id ? toIdString(m._id) : undefined,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/invitations/:id] error", error);
    return NextResponse.json(
      { message: "Error fetching invitation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = (await req.json()) as Record<string, unknown>;

    const updated = (await Invitation.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean()) as InvitationLean | null;

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...updated,
        _id: toIdString(updated._id),
        members: (updated.members ?? []).map((m) => ({
          ...m,
          _id: m._id ? toIdString(m._id) : undefined,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/invitations/:id] error", error);
    return NextResponse.json(
      { message: "Error updating invitation" },
      { status: 500 }
    );
  }
}