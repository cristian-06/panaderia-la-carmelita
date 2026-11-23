import React, { useState } from "react";

// Componente de inventario en tiempo real y registro de producción
function TablaInventarioProduccion({ rolActivo = "panadero operario" }) {
  // Estados en camelCase para el inventario y el registro de producción
  const [inventarioProductos, setInventarioProductos] = useState([
    {
      id: 1,
      producto: "Pan de bono",
      stockActual: 40,
      stockMinimo: 15,
      ultimoLote: "06:30 a. m.",
    },
    {
      id: 2,
      producto: "Croissant",
      stockActual: 12,
      stockMinimo: 15,
      ultimoLote: "07:00 a. m.",
    },
    {
      id: 3,
      producto: "Café negro",
      stockActual: 50,
      stockMinimo: 20,
      ultimoLote: "06:00 a. m.",
    },
  ]);

  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(1);
  const [cantidadProducida, setCantidadProducida] = useState("");
  const [mensajeProduccion, setMensajeProduccion] = useState("");

  // Solo panadero operario y administrador pueden registrar producción
  const puedeProducir =
    rolActivo === "panadero operario" || rolActivo === "administrador";

  // Suma el lote producido al inventario en tiempo real
  function registrarProduccion(evento) {
    evento.preventDefault();

    if (!puedeProducir) {
      setMensajeProduccion(
        `El rol "${rolActivo}" no tiene permiso para registrar producción.`
      );
      return;
    }

    const unidades = Number(cantidadProducida);
    if (!Number.isFinite(unidades) || unidades <= 0) {
      setMensajeProduccion("Ingresa una cantidad válida mayor a cero.");
      return;
    }

    const horaRegistro = new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let nombreProductoActualizado = "";

    setInventarioProductos((inventarioPrevio) =>
      inventarioPrevio.map((item) => {
        if (item.id === Number(productoSeleccionadoId)) {
          nombreProductoActualizado = item.producto;
          return {
            ...item,
            stockActual: item.stockActual + unidades,
            ultimoLote: horaRegistro,
          };
        }
        return item;
      })
    );

    setCantidadProducida("");
    setMensajeProduccion(
      `Se agregaron ${unidades} unidades de ${nombreProductoActualizado} al inventario (${horaRegistro}).`
    );
  }

  return (
    <section aria-label="Inventario en tiempo real y producción">
      <h2>Inventario en Tiempo Real y Producción - Panadería La Carmelita</h2>

      {puedeProducir ? (
        <form onSubmit={registrarProduccion}>
          <div>
            <label htmlFor="productoSeleccionado">Producto / lote</label>
            <select
              id="productoSeleccionado"
              value={productoSeleccionadoId}
              onChange={(e) => setProductoSeleccionadoId(Number(e.target.value))}
            >
              {inventarioProductos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.producto}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cantidadProducida">Unidades producidas</label>
            <input
              id="cantidadProducida"
              type="number"
              min="1"
              value={cantidadProducida}
              onChange={(e) => setCantidadProducida(e.target.value)}
              placeholder="Ej. 20"
            />
          </div>

          <button type="submit">Registrar lote de producción</button>
        </form>
      ) : (
        <p>
          Vista de consulta: el rol actual ({rolActivo}) solo puede visualizar el
          inventario.
        </p>
      )}

      {mensajeProduccion && <p role="status">{mensajeProduccion}</p>}

      <div>
        <h3>Estado actual del inventario</h3>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
              <th>Último lote</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventarioProductos.map((item) => {
              const stockBajo = item.stockActual <= item.stockMinimo;
              return (
                <tr key={item.id}>
                  <td>{item.producto}</td>
                  <td>{item.stockActual}</td>
                  <td>{item.stockMinimo}</td>
                  <td>{item.ultimoLote}</td>
                  <td>{stockBajo ? "Stock bajo" : "Disponible"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TablaInventarioProduccion;