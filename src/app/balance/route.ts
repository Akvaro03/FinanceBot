import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// Validación del body
const BalanceSchema = z.object({
  phone: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BalanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          issues: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const { phone } = parsed.data;
    const userDocRef = doc(db, "users", phone);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    return NextResponse.json(
      {
        currentBalance: userData.currentBalance ?? 0,
        income: userData.income ?? 0,
        lastPayday: userData.lastPayday?.toDate().toISOString() ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en /balance:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
