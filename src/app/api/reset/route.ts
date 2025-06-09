import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Validación del body
const ResetSchema = z.object({
  phone: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.errors },
        { status: 400 }
      );
    }

    const { phone } = parsed.data;
    const userDocRef = doc(db, "users", phone);
    const expensesColRef = collection(userDocRef, "expenses");

    // Eliminar todos los documentos en expenses
    const expensesSnapshot = await getDocs(expensesColRef);
    const deletePromises = expensesSnapshot.docs.map((docSnap) =>
      deleteDoc(docSnap.ref)
    );
    await Promise.all(deletePromises);

    // Resetear campos en el documento principal del usuario
    await updateDoc(userDocRef, {
      currentBalance: 0,
      income: 0,
      lastPayday: null,
    });

    return NextResponse.json(
      { message: "Usuario reseteado exitosamente" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al guardar el gasto:", err);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: String(err),
      },
      { status: 500 }
    );
  }
}
