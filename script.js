const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir Modal do Carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar Modal do Carrinho ao clicar fora do modal
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
});

// Fechar Modal do Carrinho ao clicar botao fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");
   
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// Atualizar Carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2 text-zinc-600">R$ ${item.price.toFixed(2)}</p>
                </div>
                    <button data-name="${item.name}" class="remove-from-cart-btn text-zinc-400">
                        Remover
                    </button>
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função de remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }

})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
});

    // Finalizar o Pedido
checkoutBtn.addEventListener("click", function(){

     const isOpen = checkEstablishmentOpen();
     if(!isOpen){
         Toastify({
            text: "Ops o WillTech Burguer está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
         }).showToast();
         
         return;
     }

    if(cart.length === 0) {
        Toastify({
                     text: "Ops você precisa adicionar um item para finalizar o pedido!",
                     duration: 3000,
                     close: true,
                     gravity: "top",
                     position: "center",
                     stopOnFocus: true,
                     style: {
                         background: "#ef4444",
                   },
                 }).showToast();
        return;
    };

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    
    // Enviar o pedido para api do whatsApp
    const cartIems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartIems);
    const phone = "47000000000"

    window.open(`https://wa.me/${phone}?text=${message} Endereço para entrega: ${addressInput.value}`, "_blank");
    cart = [];
    updateCartModal();
})

function checkEstablishmentOpen(){
    const data = new Date();
    const hours = data.getHours();
    return hours >= 18 && hours < 23;
}

const spanItem  = document.getElementById("date-span");
const isOpen = checkEstablishmentOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}