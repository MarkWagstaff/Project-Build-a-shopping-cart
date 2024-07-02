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
}

// Calculate total cost of cart items
function cartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Empty the cart
function emptyCart() {
  cart = [];
  totalCashReceived = 0;
}

// Update cart item and draw updates
function updateCartItem(productId, updateFn) {
  const cartItem = cart.find(c => c.productId === productId);
  if (cartItem) {
    updateFn(cartItem);
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
}

// Define the pay function
function pay(amount) {
  let cartSum = cartTotal();
  let cashReturn = amount - cartSum;
  return cashReturn;
}

// Event listener for the pay button
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
      let cashReturn = pay(amount);

      let paymentSummary = document.querySelector('.pay-summary');
      let div = document.createElement('div');

      // Thank customer where full payment is received, else request additional funds
      if (cashReturn >= 0) {
        div.innerHTML = `
          <p>Cash Received: ${currencySymbol}${amount}</p>
          <p>Cash Returned: ${currencySymbol}${cashReturn}</p>
          <p>Thank you!</p>
        `;
      } else {
        // Reset cash received to add any new entries
        document.querySelector('.received').value = '';
        div.innerHTML = `
          <p>Cash Received: ${currencySymbol}${amount}</p>
          <p>Remaining Balance: ${cashReturn}$</p>
          <p>Please pay additional amount.</p>
          <hr/>
        `;
      }

      paymentSummary.append(div);
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