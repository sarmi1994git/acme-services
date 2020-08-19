create database acme;

--------TABLA DE APLICACIONES------
CREATE TABLE applications(
	id serial,
	name varchar(100) NOT NULL,
	description text,
	primary key(id)
);

---------TABLA DE ROLES-------
CREATE TABLE roles(
	id serial,
	name varchar(100) NOT NULL,
	description text,
	primary key(id)
);

---------TABLA DE USUARIOS---------
CREATE TABLE users(
	id serial,
	identification varchar(15) NOT NULL,
	firstname varchar(25) NOT NULL,
	lastname varchar(25) NOT NULL,
	email varchar(100) NOT NULL,
	primary key(id)
);


--------TABLA USUARIOS_ROLES---------
CREATE TABLE users_roles(
	user_id int,
	role_id int,
	primary key(user_id,role_id),
	constraint users_roles_user_id_fkey foreign key (user_id)
		references users (id) match simple
		on update CASCADE on delete CASCADE,
	constraint users_roles_role_id_fkey foreign key (role_id)
		references roles (id) match simple
		on update CASCADE on delete CASCADE 
);


---------TABLA APLICACIONES_ROLES---------
CREATE TABLE applications_roles(
	application_id int,
	role_id int,
	primary key(application_id,role_id),
	constraint applications_roles_application_id_fkey foreign key (application_id)
		references applications (id) match simple
		on update CASCADE on delete CASCADE,
	constraint applications_roles_role_id_fkey foreign key (role_id)
		references roles (id) match simple
		on update CASCADE on delete CASCADE 
);
