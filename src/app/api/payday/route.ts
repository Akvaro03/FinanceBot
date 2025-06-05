import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
// Validación de entrada
const PaydaySchema = z.object({
  phone: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PaydaySchema.safeParse(body);

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
    const income = userData.income ?? 0;
    const currentBalance = userData.currentBalance ?? 0;

    const newBalance = currentBalance + income;

    await updateDoc(userDocRef, {
      currentBalance: newBalance,
      lastPayday: Timestamp.now(),
    });

    return NextResponse.json(
      {
        message: "Pago mensual realizado con éxito",
        newBalance,
        income,
        lastPayday: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en /payday:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
