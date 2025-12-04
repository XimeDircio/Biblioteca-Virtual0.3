-- Función para actualizar el inventario cuando se presta un libro
CREATE OR REPLACE FUNCTION update_inventory_on_loan()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrementar copias disponibles
  UPDATE public.books_inventory
  SET available_copies = available_copies - 1,
      updated_at = timezone('utc'::text, now())
  WHERE book_id = NEW.book_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar el inventario cuando se devuelve un libro
CREATE OR REPLACE FUNCTION update_inventory_on_return()
RETURNS TRIGGER AS $$
BEGIN
  -- Incrementar copias disponibles
  IF NEW.status = 'returned' AND OLD.status != 'returned' THEN
    UPDATE public.books_inventory
    SET available_copies = available_copies + 1,
        updated_at = timezone('utc'::text, now())
    WHERE book_id = NEW.book_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para préstamos nuevos
DROP TRIGGER IF EXISTS on_loan_created ON public.book_loans;
CREATE TRIGGER on_loan_created
  AFTER INSERT ON public.book_loans
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_on_loan();

-- Trigger para devoluciones
DROP TRIGGER IF EXISTS on_loan_returned ON public.book_loans;
CREATE TRIGGER on_loan_returned
  AFTER UPDATE ON public.book_loans
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION update_inventory_on_return();
