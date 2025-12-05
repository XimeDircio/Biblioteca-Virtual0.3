-- Tabla para roles de administrador
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Actualizar tabla book_loans para agregar estado de aprobación
ALTER TABLE book_loans 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Políticas RLS para admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Los admins pueden ver la tabla de admins
CREATE POLICY "Admins pueden ver admins" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Solo super_admin puede crear nuevos admins
CREATE POLICY "Super admins pueden crear admins" ON admin_users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND role = 'super_admin')
  );

-- Políticas para que admins puedan gestionar préstamos
CREATE POLICY "Admins pueden ver todos los préstamos" ON book_loans
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins pueden actualizar préstamos" ON book_loans
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Políticas para que admins puedan gestionar inventario
CREATE POLICY "Admins pueden actualizar inventario" ON books_inventory
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins pueden insertar inventario" ON books_inventory
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins pueden eliminar inventario" ON books_inventory
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Políticas para que admins puedan ver perfiles
CREATE POLICY "Admins pueden ver todos los perfiles" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );
