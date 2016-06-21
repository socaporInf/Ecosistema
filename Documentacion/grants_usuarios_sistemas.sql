GRANT insert, update, select ON TABLE seguridad.voperacion TO usuarios_sistema;
GRANT SELECT, UPDATE, INSERT ON TABLE seguridad.vusuario TO GROUP usuarios_sistema;
GRANT SELECT, UPDATE, INSERT ON TABLE global.vempresa TO GROUP usuarios_sistema;
GRANT SELECT, UPDATE, INSERT ON TABLE seguridad.varbol_privilegio TO GROUP usuarios_sistema;
GRANT SELECT, UPDATE, INSERT ON TABLE seguridad.vtipo_usuario TO GROUP usuarios_sistema;
