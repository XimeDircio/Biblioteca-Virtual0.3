"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function borrowBook(bookId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  // Verificar disponibilidad
  const { data: inventory } = await supabase
    .from("books_inventory")
    .select("available_copies")
    .eq("book_id", bookId)
    .single()

  if (!inventory || inventory.available_copies <= 0) {
    return { error: "No hay copias disponibles" }
  }

  // Verificar que el usuario no tenga ya este libro prestado
  const { data: existingLoan } = await supabase
    .from("book_loans")
    .select("*")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .eq("status", "active")
    .single()

  if (existingLoan) {
    return { error: "Ya tienes este libro en préstamo" }
  }

  // Crear préstamo (14 días de plazo)
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14)

  const { error } = await supabase.from("book_loans").insert({
    user_id: user.id,
    book_id: bookId,
    due_date: dueDate.toISOString(),
    status: "active",
  })

  if (error) {
    console.error("[v0] Error al crear préstamo:", error)
    return { error: "Error al procesar el préstamo" }
  }

  revalidatePath("/profile")
  revalidatePath(`/book/${bookId}`)

  return { success: true }
}

export async function returnBook(loanId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Usuario no autenticado" }
  }

  const { error } = await supabase
    .from("book_loans")
    .update({
      status: "returned",
      return_date: new Date().toISOString(),
    })
    .eq("id", loanId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error al devolver libro:", error)
    return { error: "Error al devolver el libro" }
  }

  revalidatePath("/profile")

  return { success: true }
}

export async function getBookAvailability(bookId: string) {
  const supabase = await createClient()

  const { data } = await supabase.from("books_inventory").select("*").eq("book_id", bookId).single()

  return data
}
