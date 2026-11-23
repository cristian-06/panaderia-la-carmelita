import React, { useState } from "react";
import FormularioLogin from "./componentes/formulario-login.jsx";
import BarraNavegacion from "./componentes/barra-navegacion.jsx";
import PanelVentasMostrador from "./componentes/panel-ventas-mostrador.jsx";
import TablaInventarioProduccion from "./componentes/tabla-inventario-produccion.jsx";
import FormularioUsuario from "./componentes/formulario-usuario.jsx";
import ModalNotificacion from "./componentes/modal-notificacion.jsx";

// Componente integrador principal de Panadería La Carmelita
function App() {
  // Estados en camelCase para sesión activa, vista actual y notificación modal
  const [sesionActiva, setSesionActiva] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("ventas");
  const [notificacion, setNotificacion] = useState({
    abierto: false,
    titulo: "",
    mensaje: "",
    tipo: "info",
  });

  // Abre el modal de notificación con un mensaje específico
  function mostrarNotificacion(titulo, mensaje, tipo = "info") {
    setNotificacion({
      abierto: true,
      titulo,
      mensaje,
      tipo,
    });
  }

  // Cierra el modal de notificación
  function cerrarNotificacion() {
    setNotificacion((estadoPrevio) => ({
      ...estadoPrevio,
      abierto: false,
    }));
  }

  // Define la vista inicial según el rol que inicia sesión
  function manejarInicioSesion(datosSesion) {
    setSesionActiva(datosSesion);

    if (datosSesion.rol === "panadero operario") {
      setVistaActiva("inventario");
    } else {
      setVistaActiva("ventas");
    }

    mostrarNotificacion(
      "Sesión iniciada",
      `Bienvenido/a (${datosSesion.correo}) con rol: ${datosSesion.rol}.`,
      "exito"
    );
  }

  // Cierra la sesión activa y regresa al formulario de ingreso
  function manejarCerrarSesion() {
    setSesionActiva(null);
    setVistaActiva("ventas");
    mostrarNotificacion(
      "Sesión cerrada",
      "Has salido del sistema de Panadería La Carmelita.",
      "info"
    );
  }

  const rolActual = sesionActiva ? sesionActiva.rol : null;

  return (
    <main>
      <h1>Panadería La Carmelita - Gestión Operativa</h1>

      {!sesionActiva ? (
        <FormularioLogin onIniciarSesion={manejarInicioSesion} />
      ) : (
        <>
          <BarraNavegacion
            rolActivo={rolActual}
            vistaActiva={vistaActiva}
            onCambiarVista={setVistaActiva}
            onCerrarSesion={manejarCerrarSesion}
          />

          {vistaActiva === "ventas" && (
            <PanelVentasMostrador rolActivo={rolActual} />
          )}

          {vistaActiva === "inventario" && (
            <TablaInventarioProduccion rolActivo={rolActual} />
          )}

          {vistaActiva === "usuarios" && (
            <FormularioUsuario rolActivo={rolActual} />
          )}
        </>
      )}

      <ModalNotificacion
        abierto={notificacion.abierto}
        titulo={notificacion.titulo}
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        onCerrar={cerrarNotificacion}
      />
    </main>
  );
}

export default App;