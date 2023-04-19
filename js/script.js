const carritoContenedor = document.querySelector(`#carritoContenedor`)
let btn = document.querySelector("#btn-carro")
let cantidadCarrito
const compras = document.querySelector('.modal-body')
const precioCarrito = document.querySelector(`.precio`)
//creacion de cards de productos 
const gridCards = document.querySelector(`.grid-card`);

productos.forEach((productos) => {

    const {nombre, id, color, precio, img} = productos
    const div = document.createElement('div')
    div.className = "card"
    div.innerHTML = 
        `
            <img src="${img}" alt="s23" class="img-prod" >
            <p class="p-prod">${nombre} - ${color}</p>
            <p class="p-precio"> $${precio}</p>
        `
    const boton = document.createElement('button')
    boton.className = "btn-compra"
    boton.innerHTML = `
        <img src="images/shop.png" alt="carrito" class="shop-boton">
        Agregar al carrito
    `
    boton.addEventListener('click', () => {
        agregarProducto(id)
    })
    div.append(boton)
    gridCards.appendChild(div)
})

//////funciones
//pushear producto al carrito

function agregarProducto(id) {
    const item = productos.find((prod) => prod.id === id);
    carrito.push(item);
    console.log(carrito);
    cantidadCarrito = carritoContenedor.textContent = carrito.length
    actualizarCarrito()
}

//actualiza carrito

const actualizarCarrito = () => {
    compras.innerHTML = ''
    carrito.forEach((prod) => {
        const div = document.createElement("div")
        div.innerHTML = `
            <img src="${prod.img}" class="img-prodCa" ></img>
            <p>${prod.nombre}</p>
            <p>Precio: $${prod.precio}</p>
            <p> <span id="cantidad"> Cantidad: </span></p>
            <button  id="btnElim" class="btn-eliminar">Borrar</button>
        `
        compras.append(div)
    })
    totalCarrito()
    guardarStorage()
}

//suma el total de los productos agregados al carrito
const totalCarrito = () => {
    precioCarrito.innerText = 'Total: $' + carrito.reduce((acc, producto) => acc += producto.precio, 0)
}

//guarda productos y cantidad de productos en el local storage

function guardarStorage() {
    cantidadCarrito = carritoContenedor.textContent = carrito.length
    localStorage.setItem(`carrito`, JSON.stringify(carrito))
    localStorage.setItem(`numCarrito`, JSON.stringify(cantidadCarrito))
} 

//muestra en el html el carrito y la cantidad de productos aunque se actualice la pagina

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem(`carrito`) || [])
    numCarrito = carritoContenedor.textContent= JSON.parse(localStorage.getItem(`numCarrito`) || 0 )
    actualizarCarrito()
}) 
