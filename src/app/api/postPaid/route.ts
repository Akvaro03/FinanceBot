import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ExpenseSchema } from "../../../../schemas/ExpenseSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ExpenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          issues: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const { phone, amount, category, description, date } = parsed.data;
    const expenseDate = date ?? new Date(); // <- usa la fecha actual si no se mandó

    // Referencia al documento del usuario
    const userDocRef = doc(db, "users", phone);
    const userSnapshot = await getDoc(userDocRef);

    let currentBalance = 0;

    if (!userSnapshot.exists()) {
      // Si no existe, crearlo con valores por defecto
      await setDoc(userDocRef, {
        income: 0,
        currentBalance: 0,
        lastPayday: Timestamp.now(),
      });
    } else {
      const userData = userSnapshot.data();
      currentBalance = userData.currentBalance ?? 0;
    }

    // 1. Agregar gasto
    const expenseRef = collection(userDocRef, "expenses");
    const newExpense = await addDoc(expenseRef, {
      amount,
      category,
      description: description || "",
      date: Timestamp.fromDate(expenseDate),
    });

    // 2. Actualizar balance
    await updateDoc(userDocRef, {
      currentBalance: currentBalance - amount,
    });

    return NextResponse.json(
      {
        message: "Gasto guardado correctamente",
        expenseId: newExpense.id,
        newBalance: currentBalance - amount,
        userCreated: !userSnapshot.exists(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error al guardar el gasto:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
