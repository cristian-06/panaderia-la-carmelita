import React from "react";

// Componente de navegación superior filtrado según el rol activo
function BarraNavegacion({
  rolActivo = "cajera",
  vistaActiva = "ventas",
  onCambiarVista,
  onCerrarSesion,
}) {
  // Define las opciones disponibles según el rol en camelCase
  const opcionesPorRol = {
    administrador: [
      { id: "ventas", etiqueta: "Ventas mostrador" },
      { id: "inventario", etiqueta: "Inventario y producción" },
      { id: "usuarios", etiqueta: "Gestión de usuarios" },
    ],
    cajera: [
      { id: "ventas", etiqueta: "Ventas mostrador" },
      { id: "inventario", etiqueta: "Inventario" },
    ],
    "panadero operario": [
      { id: "inventario", etiqueta: "Inventario y producción" },
    ],
  };

  const opcionesDisponibles =
    opcionesPorRol[rolActivo] || opcionesPorRol.cajera;

  function seleccionarSeccion(idSeccion) {
    if (typeof onCambiarVista === "function") {
      onCambiarVista(idSeccion);
    }
  }

  function ejecutarCierreSesion() {
    if (typeof onCerrarSesion === "function") {
      onCerrarSesion();
    }
  }

  return (
    <nav aria-label="Navegación principal del sistema">
      <div>
        <strong>Panadería La Carmelita</strong>
        <span> — Rol activo: {rolActivo}</span>
      </div>

      <ul>
        {opcionesDisponibles.map((opcion) => (
          <li key={opcion.id}>
            <button
              type="button"
              aria-current={vistaActiva === opcion.id ? "page" : undefined}
              onClick={() => seleccionarSeccion(opcion.id)}
            >
              {opcion.etiqueta}
            </button>
          </li>
        ))}
      </ul>

      <button type="button" onClick={ejecutarCierreSesion}>
        Cerrar sesión
      </button>
    </nav>
  );
}

export default BarraNavegacion;