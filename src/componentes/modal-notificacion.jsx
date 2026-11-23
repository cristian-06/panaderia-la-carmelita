import React from "react";

// Componente modal reutilizable para notificaciones y alertas del sistema
function ModalNotificacion({
  abierto = false,
  titulo = "Aviso del sistema",
  mensaje = "",
  tipo = "info",
  onCerrar,
}) {
  if (!abierto) return null;

  // Etiqueta descriptiva en camelCase según el tipo de notificación
  const etiquetasTipo = {
    exito: "Confirmación",
    alerta: "Advertencia",
    error: "Error",
    info: "Información",
  };

  const etiquetaEstado = etiquetasTipo[tipo] || etiquetasTipo.info;

  function cerrarModal() {
    if (typeof onCerrar === "function") {
      onCerrar();
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={titulo}>
      <div>
        <span>{etiquetaEstado}</span>
        <h3>{titulo}</h3>
        <p>{mensaje}</p>
        <button type="button" onClick={cerrarModal}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default ModalNotificacion;