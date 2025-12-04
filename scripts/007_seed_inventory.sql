-- Seed inicial del inventario de libros
-- Cada libro tendrá 3 copias disponibles por defecto

INSERT INTO books_inventory (book_id, total_copies, available_copies) VALUES
  ('1', 3, 3),
  ('2', 3, 3),
  ('3', 3, 3),
  ('4', 3, 3),
  ('5', 3, 3),
  ('6', 3, 3),
  ('7', 3, 3),
  ('8', 3, 3),
  ('9', 3, 3),
  ('10', 3, 3),
  ('11', 3, 3),
  ('12', 3, 3),
  ('13', 3, 3),
  ('14', 3, 3),
  ('15', 3, 3),
  ('16', 3, 3),
  ('17', 3, 3),
  ('18', 3, 3),
  ('19', 3, 3),
  ('20', 3, 3),
  ('21', 3, 3)
ON CONFLICT (book_id) DO NOTHING;
