import React, { useState } from "react";

// Componente de gestión de usuarios y roles para el administrador
function FormularioUsuario({ rolActivo = "administrador" }) {
  // Lista inicial de usuarios de ejemplo y campos del formulario en camelCase
  const [listaUsuarios, setListaUsuarios] = useState([
    {
      id: 1,
      nombre: "Carlos Admin",
      correo: "admin@lacarmelita.com",
      rol: "administrador",
    },
    {
      id: 2,
      nombre: "Laura Cajera",
      correo: "cajera@lacarmelita.com",
      rol: "cajera",
    },
    {
      id: 3,
      nombre: "Mateo Horno",
      correo: "panadero@lacarmelita.com",
      rol: "panadero operario",
    },
  ]);

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoNuevo, setCorreoNuevo] = useState("");
  const [rolAsignado, setRolAsignado] = useState("cajera");
  const [mensajeEstado, setMensajeEstado] = useState("");

  // Verifica si el usuario actual tiene permiso de administración
  const esAdministrador = rolActivo === "administrador";

  // Crea un nuevo usuario con su rol correspondiente
  function crearUsuario(evento) {
    evento.preventDefault();

    if (!esAdministrador) {
      setMensajeEstado("Solo el administrador puede crear usuarios.");
      return;
    }

    const nombreLimpio = nombreUsuario.trim();
    const correoLimpio = correoNuevo.trim();

    if (!nombreLimpio || !correoLimpio) {
      setMensajeEstado("Completa el nombre y el correo del usuario.");
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombreLimpio,
      correo: correoLimpio,
      rol: rolAsignado,
    };

    setListaUsuarios((usuariosPrevios) => [...usuariosPrevios, nuevoUsuario]);
    setNombreUsuario("");
    setCorreoNuevo("");
    setRolAsignado("cajera");
    setMensajeEstado(`Usuario "${nombreLimpio}" creado con rol ${rolAsignado}.`);
  }

  // Elimina un usuario por su identificador
  function eliminarUsuario(usuarioObjetivo) {
    if (!esAdministrador) {
      setMensajeEstado("Solo el administrador puede eliminar usuarios.");
      return;
    }

    const totalAdmins = listaUsuarios.filter(
      (u) => u.rol === "administrador"
    ).length;

    if (usuarioObjetivo.rol === "administrador" && totalAdmins <= 1) {
      setMensajeEstado("Debe existir al menos un administrador activo.");
      return;
    }

    setListaUsuarios((usuariosPrevios) =>
      usuariosPrevios.filter((u) => u.id !== usuarioObjetivo.id)
    );
    setMensajeEstado(`Usuario "${usuarioObjetivo.nombre}" eliminado.`);
  }

  return (
    <section aria-label="Gestión de usuarios y roles">
      <h2>Gestión de Usuarios y Roles - Panadería La Carmelita</h2>

      {!esAdministrador ? (
        <p role="alert">
          Acceso restringido: el rol actual ({rolActivo}) no tiene permisos para
          crear o eliminar usuarios.
        </p>
      ) : (
        <>
          <form onSubmit={crearUsuario}>
            <div>
              <label htmlFor="nombreUsuario">Nombre completo</label>
              <input
                id="nombreUsuario"
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                placeholder="Ej. Sofía Mostrador"
              />
            </div>

            <div>
              <label htmlFor="correoNuevo">Correo electrónico</label>
              <input
                id="correoNuevo"
                type="email"
                value={correoNuevo}
                onChange={(e) => setCorreoNuevo(e.target.value)}
                placeholder="Ej. sofia@lacarmelita.com"
              />
            </div>

            <div>
              <label htmlFor="rolAsignado">Rol asignado</label>
              <select
                id="rolAsignado"
                value={rolAsignado}
                onChange={(e) => setRolAsignado(e.target.value)}
              >
                <option value="administrador">Administrador</option>
                <option value="cajera">Cajera</option>
                <option value="panadero operario">Panadero operario</option>
              </select>
            </div>

            <button type="submit">Crear usuario</button>
          </form>

          {mensajeEstado && <p role="status">{mensajeEstado}</p>}

          <div>
            <h3>Usuarios registrados</h3>
            <ul>
              {listaUsuarios.map((usuario) => (
                <li key={usuario.id}>
                  <span>
                    {usuario.nombre} ({usuario.correo}) — Rol:{" "}
                    <strong>{usuario.rol}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarUsuario(usuario)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

export default FormularioUsuario;