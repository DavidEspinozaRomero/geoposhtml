# Frontend

Administrador y Empleados

login admin, usuarios
Crud de USUARIOS / EMPLEADOS
update de USUARIOS / EMPLEADOS

## TODOs

1. Administrador

- Integracion APIs > En caso de no fichar su jornada diaria el adminitrador sea informado vía email. (backend)
- Integracion APIs > Descargar Excel y PDF con datos de registro individual o grupal, por día, mes, año o periodo indicado. (backend)
- Integracion APIs > Descargar Excel y PDF con datos de registro individual o grupal, por día, mes, año o periodo indicado. (backend)

2. USUARIOS / EMPLEADOS

- Tiempo total efectivo de la jornada laboral (diaria y mensual)
- Acceder con usuario y contraseña (login)

3. Globales

- Pantallas (Login)
- Revizar el reset del los formularios

## DONE

1. Admin

- Pantallas (CRUD(Empleados/Empresas), Gestion(jornada laboral), Login, Registros, Eventos(CRUD), Calendario)
- Añadir usuarios
- Generar Usuario y contraseña
- Activar o desactivar usuario
- Eliminar Usuario
- Añadir empresa
- Activar o desactivar empresa
- Eliminar empresa
- Añadir jornadas de los trabajadores no como horario sino, por ejemplo. Trabaja lunes, martes jueves y sábado para que
- Visualizar registros de los trabajadores Individual y Grupal.
- Añadir información de Festivos, IT´S, Vacaciones, Ausencias a cada trabajador.
- Poder ver calendario individual y grupal con (eventos) información antes mencionada.
- Editar registros de los trabajadores Individual y Grupal.

2. USUARIOS / EMPLEADOS

- Pantallas (Workday, Calendario, Eventos, Registros)
- Registro de fecha, hora y ubicación de entrada.
- Registro de fecha, hora y ubicación de salida.
- Incidencias: texto con descripción comunicada por el trabajador.
- Vacaciones: Apartado informativo de fechas concedidas de vacaciones individuales.
- Calendario individual con información registrada por el trabajador y por el administrador.
- Visualizar registro de jornada laboral.

# Backend

## Datos

1. Usuario

- ID
- Usuario
- Contraseña
- EMAIL
- ROL (empleado | administrador)
- Empresas[]
  //- Trabajador[]

2. Empresa

- ID
- NOMBRE DE LA SOCIEDAD
- CIF
- CUENTA DE COTIZACION
- DIRECCION FISCAL

<!-- - Trabajadores[] -->

3. Trabajador

- ID
- ID_Usuario
- isActive
- NOMBRE
- DNI
- NRO SEGURIDAD SOCIAL
- DIRECCIÓN
- TELEFONO MOVIL

4. Registros

- ID
- ID_Trabajador
- ID_Empresa
- GEO
- StartDate
- EndDate
- Incidencias

5. Eventos

- ID
- Date
- Comentario

7. Dia/Workday (Trabajo por empresa)

- ID
- ID_trabajador
- IDs_empresas[]
- dia Int (lunes - domingo)
<!-- - isActive -->

6. Calendario

- eventos []

7. Evento

- ID
- ID_type
- Date
- Dia int (lunes-domingo)
- title
- description

8. Event Type

- ID
- Type (Vacaciones/Ausencia/IT´S/Festivos)

# Future

- Agregar un radio en Administrador/Gestion para seleccionar como asignar la jornada laboral por Empleado/Empresa
