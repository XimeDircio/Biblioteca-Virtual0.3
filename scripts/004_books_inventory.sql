-- Crear tabla de inventario de libros
CREATE TABLE IF NOT EXISTS public.books_inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id text NOT NULL UNIQUE,
  total_copies integer NOT NULL DEFAULT 5,
  available_copies integer NOT NULL DEFAULT 5,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.books_inventory ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver el inventario
CREATE POLICY "Cualquiera puede ver el inventario"
  ON public.books_inventory FOR SELECT
  TO authenticated
  USING (true);

-- Insertar inventario inicial para todos los libros
INSERT INTO public.books_inventory (book_id, total_copies, available_copies)
VALUES 
  ('1', 5, 5),
  ('2', 5, 5),
  ('3', 5, 5),
  ('4', 5, 5),
  ('5', 5, 5),
  ('6', 5, 5),
  ('7', 5, 5),
  ('8', 5, 5),
  ('9', 5, 5),
  ('10', 5, 5),
  ('11', 5, 5),
  ('12', 5, 5),
  ('13', 5, 5),
  ('14', 5, 5),
  ('15', 5, 5),
  ('16', 5, 5),
  ('17', 5, 5),
  ('18', 5, 5),
  ('19', 5, 5),
  ('20', 5, 5),
  ('21', 5, 5)
ON CONFLICT (book_id) DO NOTHING;
