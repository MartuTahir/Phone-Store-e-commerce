//usando fetch para traer mi archivo json de productos a un array
let productos = []
fetch("./js/stock.json")
    .then(res => res.json())
    .then(data => {
        productos = data
        crearProductos(productos)
    })

const carritoContenedor = document.querySelector(`#carritoContenedor`)
let cantidadCarrito
const compras = document.querySelector('.modal-body')
const precioCarrito = document.querySelector(`.precio`)
let vaciar = document.querySelector('.vaciar') 
const gridCards = document.querySelector(`.grid-card`);
const btnCategoria = document.querySelectorAll('.btn-categoria')
const textTodos = document.querySelector('.todos')
const btnTodos = document.querySelector('.todosP')
const textCelus = document.querySelector('.celus')
const btnCelus = document.querySelector('.celusP')
const textAuris = document.querySelector('.auris')
const btnAuris = document.querySelector('.aurisP')
const textRelojes = document.querySelector('.relojes')
const btnRelojes = document.querySelector('.relojesP')
const comprar = document.querySelector('.comprar')

//array de carrito
let carrito = []
////funcion de creacion de cards de productos

function crearProductos(prodElegidos) {
    gridCards.innerHTML = ''
    prodElegidos.forEach((productos) => {

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
}
crearProductos(productos)

/// botones de filtro de productos por categoria

btnCategoria.forEach(boton => {
    boton.addEventListener("click", (e) => {
        if (e.currentTarget.id != "todos") {
            const prodBoton = productos.filter(producto => producto.categoria === e.currentTarget.id)
            crearProductos(prodBoton)
        } else {
            crearProductos(productos)
        }
    })
})

////funcion para subrayar categoria seleccionada

function subrayados() {
    textTodos.style.textDecoration = "underline"
    btnTodos.addEventListener("click", () => {
        textRelojes.style.textDecoration = "none"
        textAuris.style.textDecoration = "none"
        textCelus.style.textDecoration = "none"
        textTodos.style.textDecoration = "underline"
    })
    btnCelus.addEventListener("click", () => {
        textRelojes.style.textDecoration = "none"
        textAuris.style.textDecoration = "none"
        textTodos.style.textDecoration = "none"
        textCelus.style.textDecoration = "underline"
    })
    btnAuris.addEventListener("click", () => {
        textRelojes.style.textDecoration = "none"
        textCelus.style.textDecoration = "none"
        textTodos.style.textDecoration = "none"
        textAuris.style.textDecoration = "underline"
    })
    btnRelojes.addEventListener("click", () => {
        textCelus.style.textDecoration = "none"
        textTodos.style.textDecoration = "none"
        textAuris.style.textDecoration = "none"
        textRelojes.style.textDecoration = "underline"
    })

}
subrayados()

///funcion para pushear producto al carrito

function agregarProducto(id) {
    const item = productos.find((prod) => prod.id === id);
    //encuentra producto repetido e incrementa la cantidad
    if(carrito.some (producto => producto.id === item.id)) {
        const productoExistente = carrito.findIndex(producto => producto.id === item.id)
        carrito[productoExistente].cantidad++
    } else {
        carrito.push(item);
    }
    console.log(carrito);
    actualizarCarrito()
    guardarStorage()
}

////funcion que actualiza el carrito

const actualizarCarrito = () => {
    //crea el div con productos agregados al carrito
    const compras = document.querySelector('.modal-body')
    compras.innerHTML = ''
    carrito.forEach((prod) => {
        const {nombre, id, color, precio, img, cantidad} = prod
        const divCarrito = document.createElement(`div`)
        divCarrito.className = 'contenedor-prod-carrito'
        divCarrito.innerHTML = `
            <img src="${img}" class="img-prodCa" ></img>
            <p class="text-prod" >${nombre}</p>
            <p class=" precio-prod">Precio: $${precio}</p>
            <p class="cantidad" > Cantidad ${cantidad} </p>
        `
        compras.appendChild(divCarrito)
        /// evento boton para eliminar producto del carrito
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
        divCarrito.appendChild(botonBorrar)
    })
    ///boton vaciar carrito
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
              vaciarCarrito()
              totalCarrito()
              guardarStorage()
            }
          })
    })
    ////boton comprar
    comprar.addEventListener("click", () => {
        //evalua si el carrito tiene productos o no
        if (carrito.length >= 1) {
            swal.fire({
                icon: 'success',
                title: '¡Gracias por tu compra! :)',
                toast: true,
                showConfirmButton: false,
                timer: 1500
            })
            vaciarCarrito()
            totalCarrito()
            guardarStorage()
        } else {
            //si no tiene productos, no puede comprar
            swal.fire({
                icon: 'error',
                title: 'No tienes nada en tu carrito',
                toast: true,
                showConfirmButton: false,
                timer: 1500
            })

        } 
        
    })
    //si el carrito esta vacio, muestra este mensaje
    if (carrito.length === 0) {
        compras.innerHTML = 'Tu carrito esta vacio'
    }
    totalCarrito()
    guardarStorage()
}

//funcion que vacia el carrito 

function vaciarCarrito() {
    carrito = []
    compras.innerHTML = 'Tu carrito esta vacio'
}
//funcion que elimina productos del carrito

function borrarProd(id) {
    console.log(id);
    const prodEliminado = carrito.find((prod) => prod.id === id);
    console.log(prodEliminado)
    console.log(carrito);
    if(prodEliminado.cantidad > 1){
        prodEliminado.cantidad--
    } else {
        carrito = carrito.filter((carritoId) => {
            return carritoId !== prodEliminado
        })
    }
    console.log(carrito);
    actualizarCarrito()
}  

//funcion que suma el total de los productos agregados al carrito
const totalCarrito = () => {
    precioCarrito.innerText = 'Total: $' + carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0)
} 

//funcion que guarda productos y cantidad de productos en el local storage

function guardarStorage() {
    //numero de productos en el carrito
    let numeroC = carrito.reduce((acc, producto) => acc + producto.cantidad,0)
    console.log(numeroC);
    cantidadCarrito = carritoContenedor.innerText = numeroC
    localStorage.setItem(`carrito`, JSON.stringify(carrito))
    localStorage.setItem(`numCarrito`, JSON.stringify(cantidadCarrito))
} 

//muestra en el html el carrito y la cantidad de productos aunque se actualice la pagina

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem(`carrito`) || [])
    numCarrito = carritoContenedor.textContent= JSON.parse(localStorage.getItem(`numCarrito`) || 0 )
    actualizarCarrito()
}) 
