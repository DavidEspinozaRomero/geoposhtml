# Frontend
Administrador y Empleados

login admin, usuarios
Crud de USUARIOS / EMPLEADOS
update de USUARIOS / EMPLEADOS

## TODOs
1. crear un administrador
* Pantallas (Login/Empleados (CRUD/Gestion/Registros/Eventos) )
* Añadir usuarios
* Generar Usuario y contraseña
* Activar o desactivar usuario
* Eliminar Usuario
* Añadir jornadas de los trabajadores no como horario sino, por ejemplo. Trabaja lunes, martes jueves y sábado para que en caso de no fichar su jornada diaria el adminitrador sea informado vía email.
* Visualizar y editar registros de los trabajadores Individual y Grupal.
* Descargar Excel y PDF con datos de registro individual o grupal, por día, mes, año o periodo indicado.
* Añadir información de Festivos, IT´S, Vacaciones, Ausencias a cada trabajador.
* Poder ver calendario individual y grupal con información antes mencionada.

2. USUARIOS / EMPLEADOS

* Pantallas (Login/Gestion/Registros/Eventos)
* Acceder con usuario y contraseña
* Registro de fecha, hora y ubicación de entrada.
* Registro de fecha, hora y ubicación de salida.
* Tiempo total efectivo de la jornada laboral (diaria y mensual)
* Visualizar registro de jornada laboral.
* Incidencias: texto con descripción comunicada por el trabajador.
* Vacaciones: Apartado informativo de fechas concedidas de vacaciones individuales.
* Calendario individual con información registrada por el trabajador y por el administrador.

# Backend

## Datos

1. Usuario
- ID
- Usuario
- Contraseña
- EMAIL
- ROL (empleado | administrador)
- Empresas[]

2. Empresa
- ID
- NOMBRE DE LA SOCIEDAD
- CIF
- CUENTA DE COTIZACION
- DIRECCION FISCAL
<!-- - Trabajadores[] -->

3. Trabajadores
- ID
- ID_Usuario
- isActive
- NOMBRE DE TRABAJADOR
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

6. Calendario
- ID
- ID_empresa
- ID_trabajador
- Date
- Dia (lunes-domingo)