//fech
fetch("./productos.json")
    .then(respuesta => respuesta.json())
    .then(productos => principal(productos))

let carrito = [];

// función principal
function principal(productos) {
    let carritoEnStorage = localStorage.getItem("carrito");
    if (carritoEnStorage) {
        carrito = JSON.parse(carritoEnStorage);
        mostrarCarrito(carrito);
    }

    mostrarPorductos(productos);

    // Buscador
    let buscador = document.getElementById("buscador-botoncito");
    let btnBuscador = document.getElementById("boton-buscar");

    buscador.addEventListener("input", () => {
        let productoEncontrado = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()));
        mostrarPorductos(productoEncontrado);

        if (productoEncontrado.length === 0) {
            let productoNoEncontrado = document.createElement("h2");
            productoNoEncontrado.innerText = "Lo siento, no encontramos el vehículo que deseas buscar";
            productoNoEncontrado.className = "";
            tarjetas.appendChild(productoNoEncontrado);
        }
    });

    // Boton carrito
    let botonCarrito = document.getElementById("carrito-button");

    botonCarrito.addEventListener("click", () => {
        if (carrito.length <= 0) {
            alerta("error", "El carrito está vacío", "Click para continuar");
        } else {
            let carritoDeCompras = document.getElementsByClassName("tapar");
            carritoDeCompras[0].className = "carrito-de-compras";
            mostrarCarrito(carrito);
            mostrarTotalDelCarrito(carrito);
        }
    });

    // Botones en el carrito
    let botonesCarrito = document.getElementsByClassName("carrito-botton-flex");

    for (let i = 0; i < botonesCarrito.length; i++) {
        let carritoDeCompras = document.getElementsByClassName("carrito-de-compras");

        if (i === 0) {
            botonesCarrito[0].addEventListener("click", () => {
                carrito = [];
                localStorage.clear();
                alerta("success", "Vehiculo adquirido con exito!", "Click para continuar");
                carritoDeCompras[0].className = "tapar";
            });
        } else if (i === 1) {
            botonesCarrito[1].addEventListener("click", () => {
                carritoDeCompras[0].className = "tapar";
            });
        } else {
            botonesCarrito[2].addEventListener("click", () => {
                carrito = [];
                localStorage.clear();
                tostada("Carrito limpiado!", "top", "#0046D2", "#002E8A");
                carritoDeCompras[0].className = "tapar";
            });
        }
    }

    // Botones de filtro
    let botonesFiltro = document.getElementsByClassName("btn-filtros");
    for (let i = 0; i < botonesFiltro.length; i++) {
        botonesFiltro[i].addEventListener("click", (e) => {
            let tipo = e.target.getAttribute("data-tipo");
            let orden = e.target.getAttribute("data-orden");
            let productoFiltrado = filtrarProductos(productos, tipo, orden);
            mostrarPorductos(productoFiltrado);
        });
    }
}


// Función para mostrar productos
function mostrarPorductos(productos) {
    let tarjetas = document.getElementById("tarjetas");
    tarjetas.innerHTML = "";
    productos.forEach(producto => {
        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-producto";
        tarjeta.innerHTML = `
            <img src="./img/${producto.rutaImagen}" alt="imagen-producto">
            <h2>${producto.nombre}</h2>
            <p><strong>$${producto.precio}</strong></p>
            <p>Stock: ${producto.stock}</p>
            <button id=${producto.id}>Agregar Para Llevar</button>
        `;
        tarjetas.appendChild(tarjeta);

        let btnAgregarAlCarrito = document.getElementById(producto.id);
        btnAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(productos, carrito, e));
    });
}

// Función para agregar productos al carrito
function agregarProductoAlCarrito(productos, carrito, e) {
    let productoId = Number(e.target.id);
    let productoEncontrado = productos.find(producto => producto.id === productoId);
    let productoEnCarrito = carrito.find(producto => producto.id === productoId);

    if (productoEncontrado.stock > 0) {
        if (productoEnCarrito) {
            if (productoEnCarrito.stock > 0) {
                productoEnCarrito.unidades++;
                productoEnCarrito.precioTotal += productoEncontrado.precio;
                productoEnCarrito.stock--;
                tostada("Producto agregado exitosamente", "bottom", "#00f155", "#208041");
            } else {
                tostada("Sin stock", "bottom", "#f10000", "#b60000");
            }
        } else {
            carrito.push({
                id: productoEncontrado.id,
                nombre: productoEncontrado.nombre,
                precioUnitario: productoEncontrado.precio,
                unidades: 1,
                rutaImagen: productoEncontrado.rutaImagen,
                precio: productoEncontrado.precio,
                precioTotal: productoEncontrado.precio,
                stock: productoEncontrado.stock - 1
            });
            tostada("Producto agregado exitosamente", "bottom", "#00f155", "#208041");
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
        tostada("Sin stock", "bottom", "#f10000", "#b60000");
    }
}

// Función para filtrar productos
function filtrarProductos(productos, tipo, orden) {
    let productosFiltrados = productos;

    if (tipo === "Vehiculos") {
        productosFiltrados = productos.filter(producto => producto.marca === "Yamaha");
    } else if (tipo === "Cuatris") {
        productosFiltrados = productos.filter(producto => producto.marca === "Yamaha");
    } else if (tipo === "Accesorios") {
        // Aquí puedes agregar la lógica para filtrar por "Accesorios"
    }

    if (orden === "asc") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "des") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    return productosFiltrados;
}

// Función para mostrar el carrito
function mostrarCarrito(carrito) {
    let tarjetas = document.getElementById("carrito-card");
    tarjetas.innerHTML = "";
    carrito.forEach(producto => {
        let tarjeta = document.createElement("div");
        tarjeta.className = "productos-carrito";
        tarjeta.innerHTML = `
            <img src= "./img/${producto.rutaImagen}" alt="imagen-producto">
            <h2>${producto.nombre}</h2>
            <p>Unidades: ${producto.unidades}</p>
            <p>Precio Unitario: $${producto.precio}</p>
            <p>Precio Total: $${producto.precioTotal}</p>
        `;
        tarjetas.appendChild(tarjeta);
    });
}

// Función para mostrar el total del carrito
function mostrarTotalDelCarrito(carrito) {
    let totalCarrito = document.getElementById("carrito-precio-total");
    totalCarrito.innerHTML = "";
    let total = document.createElement("div");
    let totalAPagar = carrito.reduce((acumulador, producto) => acumulador + producto.precioTotal, 0);
    total.innerHTML = `
        <h2>El Total a pagar es: $${totalAPagar}<h2/>
    `;
    totalCarrito.appendChild(total);
}

// Función para mostrar tostada
function tostada(mensaje, posicion, colorUno, colorDos) {
    Toastify({
        text: mensaje,
        className: "info",
        gravity: posicion,
        duration: 1500,
        style: {
            background: `linear-gradient(to bottom right, ${colorUno}, ${colorDos})`,
        }
    }).showToast();
}

// Función para mostrar alerta
function alerta(icono, titulo, texto) {
    Swal.fire({
        icon: icono,
        title: titulo,
        text: texto,
    });
}
