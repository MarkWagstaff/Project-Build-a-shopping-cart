const products = [
  { name: 'Carton of Cherries', price: 4, quantity: 0, productId: 1, image: 'cherry.jpg' },
  { name: 'Carton of Strawberries', price: 5, quantity: 0, productId: 2, image: 'strawberry.jpg' },
  { name: 'Bag of Oranges', price: 10, quantity: 0, productId: 3, image: 'orange.jpg' }
];

let cart = [];
let totalCashReceived = 0;

// Add a product to the cart
function addProductToCart(productId) {
  const product = products.find(p => p.productId === productId);
  if (product) {
    const cartItem = cart.find(c => c.productId === productId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
  }
}

// Increase product quantity in the cart
function increaseQuantity(productId) {
  updateCartItem(productId, item => item.quantity++);
}

// Decrease product quantity in the cart
function decreaseQuantity(productId) {
  updateCartItem(productId, item => {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      removeProductFromCart(productId);
    }
  });
}

// Remove a product from the cart
function removeProductFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  drawCart();
  drawCheckout();
}

// Calculate total cost of cart items
function cartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Empty the cart
function emptyCart() {
  cart = [];
  totalCashReceived = 0;
  drawCart();
  drawCheckout();
}

// Update the checkout summary
function updateCheckoutSummary(amount, cartSum) {
  let paymentSummary = document.querySelector('.pay-summary');
  let div = document.createElement('div');

  amount = parseFloat(amount);
  cartSum = parseFloat(cartSum);

  if (isNaN(amount) || isNaN(cartSum)) {
    div.innerHTML = '<p>Error: Invalid input</p>';
  } else {
    totalCashReceived += amount;
    let remainingBalance = cartSum - totalCashReceived;

    div.innerHTML = `<p>Cash Received: $${amount.toFixed(2)}</p>`;

    if (remainingBalance <= 0) {
      div.innerHTML += `
        <p>Cash Returned: $${(-remainingBalance).toFixed(2)}</p>
        <p>Thank you!</p>
      `;
    } else {
      div.innerHTML += `
        <p>Remaining Balance: $${remainingBalance.toFixed(2)}</p>
        <p>Please pay additional amount.</p>
      `;
    }

    div.innerHTML += '<hr>';

    let previousPayments = paymentSummary.innerHTML;
    if (previousPayments) {
      div.innerHTML += previousPayments;
    }
  }

  paymentSummary.innerHTML = div.innerHTML;
}

// Update cart item and draw updates
function updateCartItem(productId, updateFn) {
  const cartItem = cart.find(c => c.productId === productId);
  if (cartItem) {
    updateFn(cartItem);
    drawCart();
    drawCheckout();
  }
}

// Update and draw cart and checkout
function updateAndDraw(productId, action) {
  switch (action) {
    case 'add':
      addProductToCart(productId);
      break;
    case 'increase':
      increaseQuantity(productId);
      break;
    case 'decrease':
      decreaseQuantity(productId);
      break;
    case 'remove':
      removeProductFromCart(productId);
      break;
  }
  drawCart();
  drawCheckout();
}

document.addEventListener('DOMContentLoaded', () => {
  drawProducts();
  drawCart();
  drawCheckout();

  document.querySelector('.products').addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      let productId = parseInt(e.target.closest('.product').getAttribute('data-productId'));
      updateAndDraw(productId, 'add');
    }
  });

  document.querySelector('.cart').addEventListener('click', (e) => {
    let productId = parseInt(e.target.closest('.cart-item').getAttribute('data-productId'));
    if (e.target.classList.contains('remove')) {
      updateAndDraw(productId, 'remove');
    } else if (e.target.classList.contains('qup')) {
      updateAndDraw(productId, 'increase');
    } else if (e.target.classList.contains('qdown')) {
      updateAndDraw(productId, 'decrease');
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('pay')) {
      e.preventDefault();
      let amountInput = document.querySelector('.received').value;
      if (!amountInput || isNaN(amountInput)) {
        alert("Please enter a valid number");
        return;
      }
      let amount = parseFloat(amountInput);
      let cartSum = cartTotal();
      updateCheckoutSummary(amount, cartSum);
      document.querySelector('.received').value = '';
    }
  });

  let shoppingCart = document.querySelector('.empty-btn');
  shoppingCart.innerHTML = '<button class="empty">EMPTY CART</button>';
  shoppingCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('empty')) {
      emptyCart();
    }
  });

  let currencyChoice = document.querySelector('.currency-selector');
  let select = document.createElement('select');
  select.classList.add('currency-select');
  select.innerHTML = `
    <option value="USD">$</option>
    <option value="EUR">€</option>
    <option value="YEN">¥</option>
  `;
  currencyChoice.appendChild(select);

  select.addEventListener('change', function() {
    drawProducts();
    drawCart();
    drawCheckout();
  });
});

// Draw products on the page
function drawProducts() {
  let productList = document.querySelector('.products');
  let productItems = '';
  products.forEach((element) => {
    productItems += `<div class="product" data-productId="${element.productId}">
                       <img src="${element.image}" alt="${element.name}" />
                       <h3><b>${element.name}</b></h3>
                       <p>price: $${element.price}</p>
                       <button class="add-to-cart">ADD TO CART</button>
                     </div>`;
  });
  productList.innerHTML = productItems;
}

// Draw cart on the page
function drawCart() {
  let cartList = document.querySelector('.cart');
  let cartItems = '';
  cart.forEach((element) => {
    cartItems += `<div class="cart-item" data-productId="${element.productId}">
                  <h3>${element.name}</h3>
                  <p>price: $${element.price}</p>
                  <p>quantity: ${element.quantity}</p>
                  <p>total: $${element.price * element.quantity}</p>
                  <button class="qup">+</button>
                  <button class="qdown">-</button>
                  <button class="remove">REMOVE</button>
                </div>`;
  });
  cartList.innerHTML = cartItems.length ? cartItems : 'Cart Empty';
}

// Draw checkout section on the page
function drawCheckout() {
  let checkout = document.querySelector('.cart-total');
  checkout.innerHTML = '';

  let cartSum = cartTotal();

  let div = document.createElement('div');
  div.innerHTML = `<p>Cart Total: $${cartSum.toFixed(2)}</p>
                   <label for="cashReceived">Enter Cash Received:</label>
                   <input type="number" class="received" id="cashReceived">
                   <button class="pay">SUBMIT</button>
                   <div class="pay-summary"></div>`;
  checkout.append(div);
}
