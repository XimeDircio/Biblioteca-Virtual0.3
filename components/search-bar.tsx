"use client"

import { Search } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <input
        type="search"
        placeholder="Buscar libros por título o autor..."
        className="w-full pl-12 pr-4 py-3 border-none rounded-full outline-none text-base bg-white text-foreground shadow-sm focus:shadow-md transition-shadow"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
