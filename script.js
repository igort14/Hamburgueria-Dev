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

// Abri a modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
})

// Fechar o modal quando clicar fora 
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
})

// fechando com o botão fechar 
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");

    if(parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        // Adiconar no carrinho 
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho 
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name);

    if(existingItem){
        // se o item ja existe, aumenta apenas a quantidade +!
        existingItem.quantity +=1;
    }else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

// Atualiza o carrinho 
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4","flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <buttom class="remove-from-cart-btn cursor-pointer" data-name="${item.name}">
                    Remover
                </buttom>
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;
}

// Função para remover o item do carrinho 
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const  item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
}

//Verifica o input 
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    // Verifica se está aberto o restaurante
    const isOpen = checkRestOpen;
    if (!isOpen) {
        
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    // se não tiver nada no carrinho, não faz nada
    if (cart.length === 0) return;
    
    // Aviso para colocar o endereço de entrega
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        Toastify({
            text: "Digite o endereço!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }

    // Enviar o pedido para a api do whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("");

    const message  = encodeURI(cartItems);
    const phone = "61992027996";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    // limpar o carrinho 
    cart = [];
    updateCartModal();
})

// Verifica se o restaurante está aberto e manipula o card horário
function checkRestOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spamItem = document.getElementById("date-span");
const isOpen = checkRestOpen();

// Se está aberto remove o vermelho, se está fechado adciona o verde
if (isOpen) {
    spamItem.classList.remove("bg-red-500");
    spamItem.classList.add("bg-green-600");
} else {
    spamItem.classList.remove("bg-green-600");
    spamItem.classList.add("bg-red-500");
}