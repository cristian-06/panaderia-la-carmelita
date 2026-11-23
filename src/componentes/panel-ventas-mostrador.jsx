import React, { useState } from "react";

// Componente de ventas en mostrador físico para cajera y administrador
function PanelVentasMostrador({ rolActivo = "cajera" }) {
  // Estados en camelCase para el catálogo de mostrador, venta en curso y comprobante
  const [catalogoMostrador, setCatalogoMostrador] = useState([
    { id: 1, nombre: "Pan de bono", precio: 2500, stock: 40 },
    { id: 2, nombre: "Croissant", precio: 3500, stock: 25 },
    { id: 3, nombre: "Café negro", precio: 2000, stock: 50 },
  ]);
  const [itemsVenta, setItemsVenta] = useState([]);
  const [comprobanteGenerado, setComprobanteGenerado] = useState(null);
  const [mensajeVenta, setMensajeVenta] = useState("");

  // Solo cajera y administrador operan caja y ventas en mostrador
  const puedeVender = rolActivo === "cajera" || rolActivo === "administrador";

  // Agrega una unidad si hay stock disponible en mostrador
  function agregarProductoVenta(productoSeleccionado) {
    if (!puedeVender) {
      setMensajeVenta(
        `El rol "${rolActivo}" no tiene permiso para registrar ventas.`
      );
      return;
    }

    setComprobanteGenerado(null);
    setMensajeVenta("");

    const itemActual = itemsVenta.find(
      (item) => item.id === productoSeleccionado.id
    );
    const cantidadEnVenta = itemActual ? itemActual.cantidad : 0;

    if (cantidadEnVenta + 1 > productoSeleccionado.stock) {
      setMensajeVenta(
        `No hay suficiente stock de ${productoSeleccionado.nombre} (disponible: ${productoSeleccionado.stock}).`
      );
      return;
    }

    setItemsVenta((ventaPrevia) => {
      if (itemActual) {
        return ventaPrevia.map((item) =>
          item.id === productoSeleccionado.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...ventaPrevia, { ...productoSeleccionado, cantidad: 1 }];
    });
  }

  // Calcula el total acumulado de la venta actual
  const totalVenta = itemsVenta.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0
  );

  // Registra la venta, descuenta existencias del mostrador y genera comprobante
  function registrarVentaMostrador() {
    if (!puedeVender || itemsVenta.length === 0) return;

    setCatalogoMostrador((catalogoPrevio) =>
      catalogoPrevio.map((producto) => {
        const vendido = itemsVenta.find((item) => item.id === producto.id);
        if (!vendido) return producto;
        return {
          ...producto,
          stock: Math.max(0, producto.stock - vendido.cantidad),
        };
      })
    );

    setComprobanteGenerado({
      fechaHora: new Date().toLocaleString("es-CO"),
      items: itemsVenta,
      total: totalVenta,
    });
    setItemsVenta([]);
    setMensajeVenta("Venta registrada correctamente en mostrador.");
  }

  return (
    <section aria-label="Panel de ventas en mostrador">
      <h2>Ventas en Mostrador - Panadería La Carmelita</h2>

      {!puedeVender && (
        <p role="alert">
          Acceso restringido: el rol actual ({rolActivo}) no opera caja ni
          ventas en mostrador.
        </p>
      )}

      <div>
        <h3>Productos en mostrador</h3>
        <ul>
          {catalogoMostrador.map((producto) => (
            <li key={producto.id}>
              <span>
                {producto.nombre} - ${producto.precio.toLocaleString("es-CO")}{" "}
                (Stock: {producto.stock})
              </span>
              <button
                type="button"
                onClick={() => agregarProductoVenta(producto)}
                disabled={!puedeVender || producto.stock === 0}
              >
                Agregar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Venta actual</h3>
        {itemsVenta.length === 0 ? (
          <p>No hay productos agregados en esta venta.</p>
        ) : (
          <ul>
            {itemsVenta.map((item) => (
              <li key={item.id}>
                {item.nombre} x{item.cantidad} = $
                {(item.precio * item.cantidad).toLocaleString("es-CO")}
              </li>
            ))}
          </ul>
        )}
        <p>
          <strong>Total: ${totalVenta.toLocaleString("es-CO")}</strong>
        </p>
        <button
          type="button"
          onClick={registrarVentaMostrador}
          disabled={!puedeVender || itemsVenta.length === 0}
        >
          Registrar venta y emitir comprobante
        </button>
      </div>

      {mensajeVenta && <p role="status">{mensajeVenta}</p>}

      {comprobanteGenerado && (
        <div>
          <h3>Comprobante de mostrador</h3>
          <p>Fecha: {comprobanteGenerado.fechaHora}</p>
          <ul>
            {comprobanteGenerado.items.map((item) => (
              <li key={item.id}>
                {item.nombre} x{item.cantidad} - $
                {(item.precio * item.cantidad).toLocaleString("es-CO")}
              </li>
            ))}
          </ul>
          <p>
            <strong>
              Total pagado: ${comprobanteGenerado.total.toLocaleString("es-CO")}
            </strong>
          </p>
        </div>
      )}
    </section>
  );
}

export default PanelVentasMostrador;