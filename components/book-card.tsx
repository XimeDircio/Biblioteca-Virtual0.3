import type { Book } from "@/lib/books-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

type BookCardProps = {
  book: Book
}

export async function BookCard({ book }: BookCardProps) {
  const supabase = await createClient()

  const { data: inventory } = await supabase
    .from("books_inventory")
    .select("available_copies, total_copies")
    .eq("book_id", book.id)
    .maybeSingle()

  const availableCopies = inventory?.available_copies || 0

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-64 w-full bg-muted">
        <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={availableCopies > 0 ? "default" : "destructive"} className="shadow-md">
            {availableCopies > 0 ? `${availableCopies} disponibles` : "No disponible"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 text-balance">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {book.year}
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {book.pages} págs.
          </div>
        </div>

        <Link href={`/book/${book.id}`} className="block">
          <Button className="w-full" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Ver libro
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
