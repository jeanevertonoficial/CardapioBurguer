const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartitemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-id-modal')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')
const spanItem = document.getElementById("date-span")

let cart = []

cartBtn.addEventListener('click', () => {
    updateCartModal()
    cartModal.style.display = 'flex'
})

cartModal.addEventListener('click', (event) => {
    if(event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        
        addToCart(name, price)

        Toastify({
            text: "Item adicionado!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "green",
            },
            onClick: function(){} // Callback after click
          }).showToast();

    }
})

//add item no carrinho
function addToCart(name, price) {
    const existItem = cart.find(item => item.name === name)

    if(existItem){
        //se o item já existe, aumenta apenas a quantidade + 1
      existItem.quantity += 1
    
    } else {
            
       cart.push({
            name, 
            price,
            quantity: 1
        })
        
    }

    updateCartModal()
}

// atualiza carrinho
function updateCartModal() {
    cartitemsContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item => {
         const cartItemElement = document.createElement("div")
         cartItemElement.classList.add("flex", "justity-between", "mb-4", "flex-col")

         cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="text-small">
                    <p class="font-bold mt-2 mb-2">${item.name}</p>
                    <p class="mt-2 mb-2">(Quantidade: ${item.quantity})</p>
                    <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
            <button class="remove-from-cart-btn" data-name="${item.name}">
                 Remover
            </button>
            </div>
         `

         total += item.price * item.quantity

         
         cartitemsContainer.appendChild(cartItemElement)
        })

        cartTotal.textContent = total.toLocaleString("pt-BR", {
            style: 'currency',
            currency: "BRL"
        })

        cartCounter.textContent = cart.length
}

// remover item do carrinho 
cartitemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute('data-name')
    
        removeItemCart(name)
    }
})

function removeItemCart(nm) {
    const index = cart.findIndex(item => item.name === nm)

    if(index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}


addressInput.addEventListener("input", (event) => {
    let inpuValue = event.target.value

    if(inpuValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


// finalizar pedido
checkoutBtn.addEventListener("click", () => {
    if(!checkRestaurantopen()) {
        Toastify({
            text: "Ops! Hamburgueria está Fechada!",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "red",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return;
    }

    if( cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "44998823043"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    addressInput.value = ''
    updateCartModal()

})

//Verificar a hora e manipular o card horario
function checkRestaurantopen() {
    const data = new Date();
    const hora = data.getHours();

    return hora >= 18 && hora < 22;
}

const isOpen = checkRestaurantopen()

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.add('bg-red-500');
    spanItem.classList.remove('bg-green-600');
}