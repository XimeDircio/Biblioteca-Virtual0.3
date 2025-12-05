import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAllLoans, getInventoryStats, checkIsAdmin } from "@/app/actions/admin-actions"
import { books, categories } from "@/lib/books-data"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  const isAdmin = await checkIsAdmin()

  if (!isAdmin) {
    redirect("/?error=no-admin-access")
  }

  const [loans, stats] = await Promise.all([getAllLoans(), getInventoryStats()])

  return <AdminDashboard loans={loans} stats={stats} books={books} categories={categories} />
}
