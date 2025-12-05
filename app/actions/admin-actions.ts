"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function checkIsAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

  return !!data
}

export async function getAdminRole() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

  return data?.role || null
}

export async function getAllLoans() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("book_loans")
    .select(`
      *,
      profiles:user_id (full_name, career)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching loans:", error)
    return []
  }

  return data || []
}

export async function approveLoan(loanId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado" }
  }

  // Verificar que es admin
  const { data: adminData } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

  if (!adminData) {
    return { error: "No tienes permisos de administrador" }
  }

  const { error } = await supabase
    .from("book_loans")
    .update({
      approved: true,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      status: "active",
    })
    .eq("id", loanId)

  if (error) {
    console.error("Error approving loan:", error)
    return { error: "Error al aprobar el préstamo" }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function rejectLoan(loanId: string, reason: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado" }
  }

  // Verificar que es admin
  const { data: adminData } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

  if (!adminData) {
    return { error: "No tienes permisos de administrador" }
  }

  // Obtener el préstamo para devolver la copia al inventario
  const { data: loan } = await supabase.from("book_loans").select("book_id").eq("id", loanId).single()

  if (loan) {
    // Devolver copia al inventario
    await supabase.rpc("increment_available_copies", { book_id_param: loan.book_id })
  }

  const { error } = await supabase
    .from("book_loans")
    .update({
      approved: false,
      status: "rejected",
      rejection_reason: reason,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", loanId)

  if (error) {
    console.error("Error rejecting loan:", error)
    return { error: "Error al rechazar el préstamo" }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function markAsReturned(loanId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado" }
  }

  // Verificar que es admin
  const { data: adminData } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

  if (!adminData) {
    return { error: "No tienes permisos de administrador" }
  }

  const { error } = await supabase
    .from("book_loans")
    .update({
      status: "returned",
      return_date: new Date().toISOString(),
    })
    .eq("id", loanId)

  if (error) {
    console.error("Error marking as returned:", error)
    return { error: "Error al marcar como devuelto" }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function getInventoryStats() {
  const supabase = await createClient()

  const { data: inventory } = await supabase.from("books_inventory").select("*")

  const { data: loans } = await supabase.from("book_loans").select("book_id, status")

  const totalBooks = inventory?.reduce((acc, item) => acc + item.total_copies, 0) || 0
  const availableBooks = inventory?.reduce((acc, item) => acc + item.available_copies, 0) || 0
  const activeLoans = loans?.filter((l) => l.status === "active").length || 0
  const pendingLoans = loans?.filter((l) => l.status === "pending" || !l.approved).length || 0

  // Contar préstamos por libro para estadísticas
  const loanCounts: Record<string, number> = {}
  loans?.forEach((loan) => {
    loanCounts[loan.book_id] = (loanCounts[loan.book_id] || 0) + 1
  })

  return {
    totalBooks,
    availableBooks,
    activeLoans,
    pendingLoans,
    loanCounts,
  }
}

export async function updateInventory(bookId: string, totalCopies: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado" }
  }

  // Verificar que es admin
  const { data: adminData } = await supabase.from("admin_users").select("role").eq("user_id", user.id).single()

  if (!adminData) {
    return { error: "No tienes permisos de administrador" }
  }

  // Verificar si ya existe el inventario
  const { data: existing } = await supabase.from("books_inventory").select("*").eq("book_id", bookId).single()

  if (existing) {
    const difference = totalCopies - existing.total_copies
    const newAvailable = Math.max(0, existing.available_copies + difference)

    const { error } = await supabase
      .from("books_inventory")
      .update({
        total_copies: totalCopies,
        available_copies: newAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq("book_id", bookId)

    if (error) {
      return { error: "Error al actualizar inventario" }
    }
  } else {
    const { error } = await supabase.from("books_inventory").insert({
      book_id: bookId,
      total_copies: totalCopies,
      available_copies: totalCopies,
    })

    if (error) {
      return { error: "Error al crear inventario" }
    }
  }

  revalidatePath("/admin")
  return { success: true }
}
