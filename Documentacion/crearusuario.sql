-- DROP ROLE vleon;

CREATE ROLE josma LOGIN ENCRYPTED PASSWORD '1234';
GRANT usuarios_sistema TO josma;
