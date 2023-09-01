const carrito = {
  productos: [],

  agregarProducto: function (producto) {
    this.productos.push(producto);
  },

  eliminarProducto: function (indice) {
    if (indice >= 0 && indice < this.productos.length) {
      this.productos.splice(indice, 1);
    }
  },

  calcularTotal: function () {
    let total = 0;
    for (const producto of this.productos) {
      total += producto.precio;
    }
    return total;
  },

  mostrarCarrito: function () {
    console.log("Carrito de la librería:");
    for (let i = 0; i < this.productos.length; i++) {
      console.log(
        `${i + 1}. ${this.productos[i].nombre} - Precio: $${this.productos[i].precio}`
      );
    }
    console.log(`Total: $${this.calcularTotal()}`);
  },

  buscarProductoPorNombre: function (nombre) {
    return this.productos.find((producto) => producto.nombre === nombre);
  },

  filtrarProductosPorPrecio: function (precioMaximo) {
    return this.productos.filter((producto) => producto.precio <= precioMaximo);
  },

  confirmarPedido: function () {
    if (this.productos.length === 0) {
      showPopup("El carrito está vacío. Agregue productos antes de confirmar el pedido.", "Cerrar");
      return;
    }

    const total = this.calcularTotal();
    showPopup(`¿Desea confirmar el pedido por un total de $${total}?`, "Cancelar", "Confirmar", () => {
      alert(`Pedido confirmado. Total: $${total}`);
      this.productos = []; // Vaciar el carrito después de confirmar el pedido
      actualizarCarrito();
    });
  }
};

function Producto(nombre, autor, precio, descripcion, thumbnailUrl) {
  this.nombre = nombre;
  this.autor = autor;
  this.precio = precio;
  this.descripcion = descripcion;
  this.thumbnailUrl = thumbnailUrl;
}

document.addEventListener("DOMContentLoaded", function () {
  const listaProductosElement = document.getElementById("lista-productos");
  const agregarLibrosButton = document.getElementById("cargar-libros");

  agregarLibrosButton.addEventListener("click", () => {
    obtenerLibrosAlAzar();
  });

  const confirmarPedidoButton = document.getElementById("confirmar-pedido");
  confirmarPedidoButton.addEventListener("click", () => {
    carrito.confirmarPedido();
  });

  const popupCancelButton = document.getElementById("popup-cancel");
  popupCancelButton.addEventListener("click", () => {
    closePopup();
  });

  const popupConfirmButton = document.getElementById("popup-confirm");
  popupConfirmButton.addEventListener("click", () => {
    closePopup();
    carrito.confirmarPedido();
  });

  actualizarCarrito();
});

function showPopup(message, cancelButtonText, confirmButtonText, callback) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupCancelButton = document.getElementById("popup-cancel");
  const popupConfirmButton = document.getElementById("popup-confirm");

  popupMessage.textContent = message;
  popupCancelButton.textContent = cancelButtonText;
  popupConfirmButton.textContent = confirmButtonText;
  popup.style.display = "block";

  popupCancelButton.addEventListener("click", () => {
    closePopup();
  });

  popupConfirmButton.addEventListener("click", () => {
    closePopup();
    if (typeof callback === "function") {
      callback();
    }
  });
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

function actualizarCarrito() {
  const carritoListaElement = document.getElementById("carrito-lista");
  const totalCarritoElement = document.getElementById("total-carrito");

  carritoListaElement.innerHTML = carrito.productos.map(producto => `<li>${producto.nombre} - Precio: $${producto.precio.toFixed(2)}</li>`).join('');
  totalCarritoElement.textContent = `Total: $${carrito.calcularTotal().toFixed(2)}`;
}

function obtenerLibrosAlAzar() {
  const apiUrl = "https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=10";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const libros = data.items || [];

      const listaProductosElement = document.getElementById("lista-productos");
      listaProductosElement.innerHTML = "";

      libros.forEach((libro) => {
        const title = libro.volumeInfo.title || "Título Desconocido";
        const authors = libro.volumeInfo.authors ? libro.volumeInfo.authors.join(", ") : "Autor Desconocido";
        const description = libro.volumeInfo.description || "Sin descripción disponible";
        const rawPrice = Math.random() * (30 - 5) + 5;
        const price = Math.round(rawPrice * 100) / 100; // Redondea a 2 decimales
        const thumbnailUrl = libro.volumeInfo.imageLinks ? libro.volumeInfo.imageLinks.thumbnail : "imagen-por-defecto.jpg";

        const libroRandom = new Producto(title, authors, price, description, thumbnailUrl);

        const botonAgregarAlCarrito = document.createElement("button");
        botonAgregarAlCarrito.textContent = "Agregar al Carrito";
        botonAgregarAlCarrito.addEventListener("click", () => {
          carrito.agregarProducto(libroRandom);
          actualizarCarrito();
        });

        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <h3>${libroRandom.nombre}</h3>
          <p>Autor: ${libroRandom.autor}</p>
          <p>Precio: $${libroRandom.precio.toFixed(2)}</p>
          <img src="${libroRandom.thumbnailUrl}" alt="Portada del libro">
        `;
        listItem.appendChild(botonAgregarAlCarrito);

        listaProductosElement.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error al obtener libros:", error);
    });
}
