const containerProducts = document.getElementById('container-products');
const modal = document.getElementById('ventana-modal');
const carrito = document.getElementById('carrito');
const totalCarrito = document.getElementById('total');
const btnClose = document.getElementsByClassName('close')[0];
const containerCart = document.querySelector('.modal-body');
const iconMenu = document.getElementById('icon-menu');
const contenedorProductos = document.querySelector('.contenedor-carrito');
const cantidadProductos = document.querySelector('.count-products');
let productosCarrito = [];

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
    iconMenu.addEventListener('click', showMenu);

    document.addEventListener('DOMContentLoaded', () => {
        renderizarProductos();
        cargarCarritoLocalStorage();
        mostrarProductosCarrito();
    });

    containerProducts.addEventListener("click", agregarProducto);
    containerCart.addEventListener('click', eliminarProducto);
    containerCart.addEventListener('change', seleccionarGustos);
   
    carrito.onclick = function () {
        modal.style.display = 'block';
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

function seleccionarGustos(e) {
    const selectElement = e.target;
    if (selectElement.classList.contains('select-gustos')) {
        const productoId = parseInt(selectElement.parentElement.querySelector('.agregar-carrito').id);
        const producto = productosCarrito.find((p) => p.id === productoId);
        const selectedGustos = Array.from(selectElement.selectedOptions).map(option => option.text);
       
        if (selectedGustos.length <= 3) {
            producto.gustos = selectedGustos;
        } else {
            
            producto.gustos = selectedGustos.slice(0, 3);
            selectElement.value = producto.gustos; 
        }

        guardarProductosLocalStorage();
        mostrarProductosCarrito();
    }
}

function eliminarProducto(e) {
    if (e.target.classList.contains('eliminar-producto')) {
   
        const productoId = parseInt(e.target.getAttribute('id'));
       
        productosCarrito = productosCarrito.filter((producto) => producto.id !== productoId);
        guardarProductosLocalStorage();
        mostrarProductosCarrito();
    }
}

function cargarCarritoLocalStorage() {
    productosCarrito = JSON.parse(localStorage.getItem('productosLS')) || [];
}

function agregarProducto(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")) {
const productoAgregado = e.target.parentElement;

leerDatosProducto(productoAgregado);
    }
}

function leerDatosProducto(producto) {
    const datosProducto = new Producto(
        producto.querySelector('img').src,
        producto.querySelector('h4').textContent,
        Number(producto.querySelector('p').textContent.replace('$', '')),
        parseInt(producto.querySelector('a').getAttribute('id'))
    );

    datosProducto.obtenerTotal();

    agregarAlCarrito(datosProducto);
}

function agregarAlCarrito(productoAgregar) {
   
    const existeEnCarrito = productosCarrito.some((producto) => producto.id === productoAgregar.id);
   
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

    console.log(productosCarrito);
    guardarProductosLocalStorage();
    mostrarProductosCarrito();

}

function guardarProductosLocalStorage() {
    localStorage.setItem('productosLS', JSON.stringify(productosCarrito));
}

function mostrarProductosCarrito() {
    limpiarHTML();

    productosCarrito.forEach((producto) => {
        const { imagen, nombre, precio, cantidad, subtotal, id } = producto;

        const div = document.createElement('div');
        div.classList.add('contenedor-producto');
        div.innerHTML = `
            <img src="${imagen}" width="100">
            <P>${nombre}</P>
            <P>$${precio}</P>
            <P>${cantidad}</P>
            <P>$${subtotal}</P>
            <a href="#" class="eliminar-producto" id="${id}"> X </a>
        `;

        containerCart.appendChild(div);
    });

    mostrarCantidadProductos();
    calcularTotal();
}

function calcularTotal() {
    let total = productosCarrito.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0);
   
    totalCarrito.innerHTML = `Total a Pagar: $ ${total}`;
}

function mostrarCantidadProductos() {
    let contarProductos;

    if (productosCarrito.length > 0) {
       
        contenedorProductos.style.display = 'flex';
        contenedorProductos.style.alignItems = 'center';
        cantidadProductos.style.display = 'flex';
        contarProductos = productosCarrito.reduce((cantidad, producto) => cantidad + producto.cantidad, 0);
        cantidadProductos.innerText = `${contarProductos}`;
    } else {
       
        contenedorProductos.style.display = 'block';
        cantidadProductos.style.display = 'none';
    }
}

function limpiarHTML() {
    while (containerCart.firstChild) {
        containerCart.removeChild(containerCart.firstChild);
    }
}

function ocultarModal() {
    modal.style.display = 'none';
}

function showMenu() {
    let navBar = document.getElementById('navigation-bar');

    if (navBar.className === 'navigation-bar') {
        navBar.className += 'responsive';
    } else {
        navBar.className = 'navigation-bar';
    }
}

function ocultarModal() {
    modal.style.display = 'none';
}

function renderizarProductos() {
    productos.forEach((producto) => {
        const divCard = document.createElement('div');
        divCard.classList.add('card');

        const selectGustos = document.createElement('select');
        selectGustos.classList.add('select-gustos');

        gustosDisponibles.forEach((gusto) => {
            const opcion = document.createElement('option');
            opcion.value = gusto.id;
            opcion.text = gusto.nombre;
            selectGustos.appendChild(opcion);
        });

        divCard.innerHTML += `
        <img src="./Fotos/${producto.img}" alt="${producto.nombre}" />
        <h4> ${producto.nombre} </h4>
        <p> $ ${producto.precio}</p>
        <label for="gustos">Selecciona gustos:</label>
            ${selectGustos.outerHTML}
        <a id="${producto.id}" class="boton agregar-carrito" href="#">Agregar</a>
        `;

        containerProducts.appendChild(divCard);
    });
}
