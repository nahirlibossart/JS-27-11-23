const file = "../data/productos.json";
const contenedorGustos = document.createElement("div");
contenedorGustos.classList.add("contenedor-gustos");
const containerProductos = document.getElementById("container-productos");
const modal = document.getElementById("ventana-modal");
const carrito = document.getElementById("carrito");
const totalCarrito = document.getElementById("total");
const btnClose = document.getElementsByClassName("close")[0];
const containerCart = document.querySelector(".modal-body");
const iconoMenu = document.getElementById("icono-menu");
const contenedorProductos = document.querySelector(".contenedor-carrito");
const cantidadProductos = document.querySelector(".count-products");
const finalizarCompra = document.querySelector("#finalizar-compra");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
let productosCarrito = [];
let saboresSeleccionados = [];
const cantidadSabores = 4;

function mostrarGustos() {
  for (const gusto of gustosDisponibles) {
    let cardGustos = document.createElement("div");
    cardGustos.classList.add("card");

    cardGustos.innerHTML = `
                      <img class="img-gustos" src="../Fotos/${gusto.img}" alt="${gusto.nombre}" />
                      <div>
                          <h6>${gusto.nombre}</h6>
                          
                      </div>
     `;

    contenedorGustos.appendChild(cardGustos);
    document.body.insertBefore(contenedorGustos, document.body.firstChild);
  }
}
mostrarGustos();

class Producto {
  constructor(imagen, nombre, precio, id) {
    this.imagen = imagen;
    this.nombre = nombre;
    this.precio = precio;
    this.id = id;
    this.cantidad = 1;
    this.subtotal = 0;
    this.gustos = [];
  }

  obtenerTotal() {
    this.subtotal = this.precio * this.cantidad;
  }
}

cargarEventos();

function cargarEventos() {
  iconoMenu.addEventListener("click", showMenu);

  document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    cargarCarritoLocalStorage();
    mostrarProductosCarrito();
  });

  containerProductos.addEventListener("click", agregarProducto);
  containerCart.addEventListener("click", eliminarProducto);
  finalizarCompra.addEventListener("click", compraFinalizada);
  vaciarCarrito.addEventListener("click", limpiarCarrito);

  carrito.onclick = function () {
    modal.style.display = "block";
  };

  btnClose.onclick = function () {
    ocultarModal();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      ocultarModal();
    }
  };
}

function eliminarProducto(e) {
  if (e.target.classList.contains("eliminar-producto")) {
    const productoId = parseInt(e.target.getAttribute("id"));

    productosCarrito = productosCarrito.filter(
      (producto) => producto.id !== productoId
    );
    guardarProductosLocalStorage();
    mostrarProductosCarrito();
  }
}

function cargarCarritoLocalStorage() {
  productosCarrito = JSON.parse(localStorage.getItem("productosLS")) || [];
}

function agregarProducto(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const productoAgregado = e.target.parentElement;

    leerDatosProducto(productoAgregado);
  }
}

function leerDatosProducto(producto) {
  let saboresSeleccionados = [];

  const imagen = producto.querySelector("img").src;
  const nombre = producto.querySelector("h4").textContent;
  const precio = Number(
    producto.querySelector("p").textContent.replace("$", "")
  );
  const id = parseInt(producto.querySelector("a").getAttribute("id"));

  let primerSabor, segundoSabor, tercerSabor, cuartoSabor;

  const sabor1 = document.getElementById("sabor1");
  const sabor2 = document.getElementById("sabor2");
  const sabor3 = document.getElementById("sabor3");
  const sabor4 = document.getElementById("sabor4");
  const sabor5 = document.getElementById("sabor5");
  const sabor6 = document.getElementById("sabor6");
  const sabor7 = document.getElementById("sabor7");
  const sabor8 = document.getElementById("sabor8");
  const sabor9 = document.getElementById("sabor9");
  const sabor10 = document.getElementById("sabor10");
  const sabor11 = document.getElementById("sabor11");
  const sabor12 = document.getElementById("sabor12");

  const elementosSabores = [
    sabor1,
    sabor2,
    sabor3,
    sabor4,
    sabor5,
    sabor6,
    sabor7,
    sabor8,
    sabor9,
    sabor10,
    sabor11,
    sabor12,
  ];

  switch (id) {
    case 1:
      primerSabor = sabor1.value;
      segundoSabor = sabor2.value;
      tercerSabor = sabor3.value;
      cuartoSabor = sabor4.value;
      break;
    case 2:
      primerSabor = sabor5.value;
      segundoSabor = sabor6.value;
      tercerSabor = sabor7.value;
      cuartoSabor = sabor8.value;
      break;
    case 3:
      primerSabor = sabor9.value;
      segundoSabor = sabor10.value;
      tercerSabor = sabor11.value;
      cuartoSabor = sabor12.value;
      break;
    default:
      Swal.fire({
        icon: "error",
        title: "No ha seleccionado ningún producto",
        position: "center",
        width: 100,
        toast: true,
        showConfirmButton: true,
        background: "hotpink",
        color: "whitesmoke",
      });

      break;
  }

  saboresSeleccionados.push(primerSabor);
  saboresSeleccionados.push(segundoSabor);
  saboresSeleccionados.push(tercerSabor);
  saboresSeleccionados.push(cuartoSabor);

  elementosSabores.forEach((element) => (element.value = "0"));

  const datosProducto = new Producto(imagen, nombre, precio, id);
  datosProducto.gustos = obtenerNombresGusto(saboresSeleccionados);
  datosProducto.obtenerTotal();

  agregarAlCarrito(datosProducto);
}

function obtenerNombresGusto(arraySabores) {
  let gustos = [];

  arraySabores = arraySabores.filter((sabor) => sabor !== "0");

  if (arraySabores.length !== 0) {
    gustos = gustosDisponibles
      .filter((gusto) => arraySabores.includes(String(gusto.id)))
      .map((gusto) => gusto.nombre);
  }

  return gustos;
}

function agregarAlCarrito(productoAgregar) {
  const existeEnCarrito = productosCarrito.some(
    (producto) => producto.id === productoAgregar.id
  );

  if (existeEnCarrito) {
    const productos = productosCarrito.map((producto) => {
      if (producto.id === productoAgregar.id) {
        producto.cantidad++;
        producto.subtotal = producto.precio * producto.cantidad;

        return producto;
      } else {
        return producto;
      }
    });

    productosCarrito = productos;
  } else {
    productosCarrito.push(productoAgregar);
  }

  guardarProductosLocalStorage();
  mostrarProductosCarrito();
}

function guardarProductosLocalStorage() {
  localStorage.setItem("productosLS", JSON.stringify(productosCarrito));
}

function mostrarProductosCarrito() {
  limpiarHTML();

  productosCarrito.forEach((producto) => {
    const { imagen, nombre, precio, cantidad, subtotal, id, gustos } = producto;

    const div = document.createElement("div");
    div.classList.add("contenedor-producto");
    div.innerHTML = `
            <img src="${imagen}" width="100">
            <P>${nombre}</P>
            <P>$${precio}</P>
            <P>${cantidad}</P>
            <p>${gustos.length === 0 ? "Sin gustos seleccionados" : gustos}</p>
            <P>$${subtotal}</P>
            <a href="#" class="eliminar-producto" id="${id}"> X </a>
            `;

    containerCart.appendChild(div);
  });
  mostrarCantidadProductos();
  calcularTotal();
}

function calcularTotal() {
  let total = productosCarrito.reduce(
    (sumaTotal, producto) => sumaTotal + producto.subtotal,
    0
  );

  totalCarrito.innerHTML = `Total a Pagar: $ ${total}`;
}

function mostrarCantidadProductos() {
  let contarProductos;

  if (productosCarrito.length > 0) {
    contenedorProductos.style.display = "flex";
    contenedorProductos.style.alignItems = "center";
    cantidadProductos.style.display = "flex";
    contarProductos = productosCarrito.reduce(
      (cantidad, producto) => cantidad + producto.cantidad,
      0
    );
    cantidadProductos.innerText = `${contarProductos}`;
  } else {
    contenedorProductos.style.display = "block";
    cantidadProductos.style.display = "none";
  }
}

function limpiarHTML() {
  while (containerCart.firstChild) {
    containerCart.removeChild(containerCart.firstChild);
  }
}

function ocultarModal() {
  modal.style.display = "none";
}

function showMenu() {
  let navbar = document.getElementById("miNav");

  if (navbar.className === "nav") {
    navbar.className += "responsive";
  } else {
    navbar.className = "nav";
  }
}

async function realizarPeticion(datos) {
  try {
    const response = await fetch(datos);

    if (!response.ok) {
      throw new Error(
        `Error en la petición: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  } finally {
  }
}

function compraFinalizada() {
  Swal.fire({
    icon: "success",
    iconColor: "hotpink",
    title: "Compra finalizada",
    text: "¡Su compra se realizó con exito!",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "hotpink",

    imageUrl: " ../Fotos/logo_cremoso.jpg",
    imageWidht: "150",
    imageHeight: "150",
    imageAlt: "Imagen logo Heladería Cremoso",
  });

  eliminarCarritoLS();
  cargarCarritoLocalStorage();
  mostrarProductosCarrito();
  ocultarModal();
}

function eliminarCarritoLS() {
  localStorage.removeItem("productosLS");
}

function limpiarCarrito() {
  Swal.fire({
    title: "Limpiar carrito",
    text: "¿Confirma que desea vaciar el carrito de compras?",
    icon: "question",
    iconColor: "hotpink",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "hotpink",
  }).then((btnResponse) => {
    if (btnResponse.isConfirmed) {
      Swal.fire({
        title: "Vaciando Carrito",
        icon: "success",
        iconColor: "hotpink",
        text: "Su carrito de compras fue vaciado con éxito.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "hotpink",
      });
      eliminarCarritoLS();
      cargarCarritoLocalStorage();
      mostrarProductosCarrito();
      ocultarModal();
    } else {
      Swal.fire({
        title: "Operación cancelada",
        icon: "info",
        iconColor: "hotpink",
        text: "La operación de vaciar el carrito de compras fue cancelada",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "hotpink",
      });
    }
  });
}

function limpiarContenedorProductos() {
  while (containerProductos.firstChild) {
    containerProductos.removeChild(containerProductos.firstChild);
  }
}

async function renderizarProductos() {
  const productos = await realizarPeticion(file);

  let inicio = 0,
    fin = 0;

  for (let i = 0; i < productos.length; i++) {
    inicio = i * cantidadSabores;
    fin = inicio + cantidadSabores;

    const divCard = document.createElement("div");
    divCard.classList.add("card");

    const saboresContainer = document.createElement("div");
    saboresContainer.classList.add("sabores-container");

    for (let j = inicio; j < fin; j++) {
      const label = document.createElement("label");
      label.setAttribute("for", `sabor${j + 1}`);

      const selectGustos = document.createElement("select");
      selectGustos.classList.add("select-gustos");
      selectGustos.setAttribute("id", `sabor${j + 1}`);

      gustosDisponibles.forEach((gusto) => {
        const opcion = document.createElement("option");
        opcion.value = gusto.id;
        opcion.text = gusto.nombre;
        selectGustos.appendChild(opcion);
      });

      saboresContainer.append(label);
      saboresContainer.append(selectGustos);
    }

    divCard.innerHTML += `
                                <img src="./Fotos/${productos[i].img}" alt="${productos[i].nombre}" />
                                <h4> ${productos[i].nombre} </h4>
                                <p> $ ${productos[i].precio}</p>
                                ${saboresContainer.outerHTML}
                                <a id="${productos[i].id}" class="boton agregar-carrito" href="#">Agregar</a>
                            `;

    containerProductos.appendChild(divCard);
  }
}

const pie = document.createElement("div");

pie.innerHTML = `<footer> Nahir Libossart - 2023 </footer>
`;
document.body.append(pie);
