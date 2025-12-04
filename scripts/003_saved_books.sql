-- Crear tabla para libros guardados por los usuarios
create table if not exists public.saved_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  book_id text not null,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, book_id)
);

-- Habilitar Row Level Security
alter table public.saved_books enable row level security;

-- Políticas RLS para saved_books
create policy "Los usuarios pueden ver sus propios libros guardados"
  on public.saved_books for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden guardar libros"
  on public.saved_books for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar sus libros guardados"
  on public.saved_books for delete
  using (auth.uid() = user_id);
