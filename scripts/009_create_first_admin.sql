-- Script para crear el primer administrador
-- Ejecutar este script después de que un usuario se registre
-- Reemplaza 'EMAIL_DEL_ADMIN' con el email del usuario que será admin

-- Primero, buscar el user_id por email (esto debe ejecutarse manualmente)
INSERT INTO admin_users (user_id, role)
SELECT id, 'super_admin' 
FROM auth.users 
WHERE email = 'koemihazumi@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Alternativamente, si conoces el UUID del usuario:
-- INSERT INTO admin_users (user_id, role) VALUES ('UUID_DEL_USUARIO', 'super_admin');

-- Para ver los usuarios registrados (solo referencia):
-- SELECT id, email FROM auth.users;
