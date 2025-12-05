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
    .maybeSingle()

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
    .maybeSingle()

  if (existingLoan) {
    return { error: "Ya tienes este libro en préstamo" }
  }

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14)

  const { error } = await supabase.from("book_loans").insert({
    user_id: user.id,
    book_id: bookId,
    due_date: dueDate.toISOString(),
    status: "pending",
    approved: false,
  })

  if (error) {
    console.error("Error al crear préstamo:", error)
    return { error: "Error al procesar el préstamo" }
  }

  // Reducir copia disponible
  await supabase
    .from("books_inventory")
    .update({ available_copies: inventory.available_copies - 1 })
    .eq("book_id", bookId)

  revalidatePath("/profile")
  revalidatePath(`/book/${bookId}`)

  return { success: true, message: "Solicitud enviada. Un administrador debe aprobar tu préstamo." }
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
    console.error("Error al devolver libro:", error)
    return { error: "Error al devolver el libro" }
  }

  revalidatePath("/profile")

  return { success: true }
}

export async function getBookAvailability(bookId: string) {
  const supabase = await createClient()

  const { data } = await supabase.from("books_inventory").select("*").eq("book_id", bookId).maybeSingle()

  return data
}

export async function getUserLoanForBook(bookId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("book_loans")
    .select("*")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .in("status", ["active", "pending"])
    .maybeSingle()

  return data
}
