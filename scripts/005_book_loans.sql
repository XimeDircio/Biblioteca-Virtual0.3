-- Crear tabla de préstamos de libros
CREATE TABLE IF NOT EXISTS public.book_loans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id text NOT NULL,
  loan_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  due_date timestamp with time zone NOT NULL,
  return_date timestamp with time zone,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.book_loans ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios préstamos
CREATE POLICY "Los usuarios pueden ver sus propios préstamos"
  ON public.book_loans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden crear préstamos
CREATE POLICY "Los usuarios pueden crear préstamos"
  ON public.book_loans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propios préstamos
CREATE POLICY "Los usuarios pueden actualizar sus propios préstamos"
  ON public.book_loans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS book_loans_user_id_idx ON public.book_loans(user_id);
CREATE INDEX IF NOT EXISTS book_loans_book_id_idx ON public.book_loans(book_id);
CREATE INDEX IF NOT EXISTS book_loans_status_idx ON public.book_loans(status);
