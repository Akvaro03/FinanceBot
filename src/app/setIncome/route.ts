import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { IncomeSchema } from "../../../schemas/IncomeSchema";
import { db } from "../../../lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = IncomeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          issues: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const { phone, amount } = parsed.data;
    const userDocRef = doc(db, "users", phone);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // Si no existe, lo creamos con income y campos por defecto
      await setDoc(userDocRef, {
        income: amount,
        currentBalance: 0,
        lastPayday: Timestamp.now(),
      });

      return NextResponse.json(
        {
          message: "Usuario creado con sueldo",
          income: amount,
          userCreated: true,
        },
        { status: 201 }
      );
    } else {
      // Usuario ya existe, solo actualizar income
      await updateDoc(userDocRef, {
        income: amount,
      });

      return NextResponse.json(
        {
          message: "Sueldo actualizado exitosamente",
          income: amount,
          userCreated: false,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Error al actualizar income:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
