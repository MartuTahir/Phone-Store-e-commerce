const carritoContenedor = document.querySelector(`#carritoContenedor`)
let btn = document.querySelector("#btn-carro")
let cantidadCarrito
const compras = document.querySelector('.modal-body')
const precioCarrito = document.querySelector(`.precio`)
let eliminar = document.querySelector('.btn-eliminar')
let vaciar = document.querySelector('.vaciar')
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
        swal.fire({
            icon: 'success',
            title: "¡Tu producto ya está en el carrito!",
            showConfirmButton: false,
            toast: true,
            timer: 1500
        })
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
        const {nombre, id, color, precio, img} = prod
        const div = document.createElement("div")
        div.className = 'contenedor-prod-carrito'
        div.innerHTML = `
            <img src="${img}" class="img-prodCa" ></img>
            <p class="text-prod" >${nombre}</p>
            <p class="text-prod">Precio: $${precio}</p>
        `
        const botonBorrar = document.createElement('button')
        botonBorrar.className = "btn-eliminar"
        botonBorrar.innerHTML = `<img class="trash" src="./images/trash-svgrepo-com.svg">`
        botonBorrar.addEventListener('click', () => {
            borrarProd(id)
            Swal.fire({
                iconHtml: '<img class="trash2" src="./images/trash2-svgrepo-com.svg">',
                title: 'Producto borrado',
                toast: true,
                showConfirmButton: false,
                timer: 1500
              })
        })
        div.append(botonBorrar)
        compras.append(div)
    })
    vaciar = document.querySelector('.vaciar')
    vaciar.addEventListener("click", () => {
        Swal.fire({
            title: '¿Estas seguro de vaciar el carrito?',
            toast: true,
            customClass: {
                title: 'title-alert'
            },
            showCancelButton: true,
            confirmButtonText: 'Si',
            confirmButtonColor: '#19695f',
            cancelButtonText: `Cancelar`,
            cancelButtonColor: 'rgb(155, 18, 18)',
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                icon: 'success',
                title: 'Se vació tu carrito',
                toast: true,
                showConfirmButton: false,
                timer: 1500
              })
              carrito = []
              compras.innerHTML = 'Tu carrito esta vacio'
              totalCarrito()
              guardarStorage()
            }
          })
    })
    totalCarrito()
    guardarStorage()
}

//suma el total de los productos agregados al carrito
const totalCarrito = () => {
    precioCarrito.innerText = 'Total: $' + carrito.reduce((acc, producto) => acc += producto.precio, 0)
}

//elimina productos del carrito

function borrarProd(id) {
    console.log(id);
    const prodEliminado = carrito.find((prod) => prod.id === id);
    console.log(prodEliminado)
    console.log(carrito);
    carrito = carrito.filter((carritoId) => {
        return carritoId !== prodEliminado
    })
    console.log(carrito);
    actualizarCarrito()
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
