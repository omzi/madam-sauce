// Add To Cart + Animation
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach((button, index) => {
  button.addEventListener('click', e => {
    // Main Add To Cart Functionality
    let { id, name, price, quantity } = addToCartButtons[index].dataset;

    quantity--
    if (quantity >= 0) {
      button.classList.add('added', 'disabled');
      const itemExists = cart.basket.filter(item => item.itemId === id);
      
      itemExists.length 
        ? cart.updateItem(id, itemExists[+[]].quantity + 1)
        : cart.addItem(id, name, 1, parseInt(price))

      addToCartButtons[index].setAttribute('data-quantity', quantity)
      cartCount.innerText = cart.count()
      setCookie('cart', JSON.stringify(cart.basket), 7)
      
      // Make a request to DB to update food quantity. To lazy to do it😅

      setTimeout(() => {
        button.classList.remove('added', 'disabled');
      }, 3e3);
    } else {
      setTimeout(() => {
        addToCartButtons[index].innerText = 'Out of stock :(';
      }, 3e3);
    }
  })
})

const link = document.querySelector('.twitter-link');
if (link) {
  link.onclick = e => {
    e.preventDefault();
    window.open('https://twitter.com/intent/follow?screen_name=o_obioha', '_blank');
  }
}

addEventListener('DOMContentLoaded', () => {
  const tabContent = document.getElementById(location.href.split('/').pop());
  if (tabContent) tabContent.scrollIntoView();
})

// const navTabs = document.querySelectorAll('[data-tab-href]');

// const switchTab = e => {
//   if (!e.srcElement.classList.contains('active')) {
//     const _id = e.srcElement.dataset.tabHref.substr(1);
//     document.querySelector('.nav-link.active').classList.remove('active');
//     e.srcElement.classList.add('active');

//     document.querySelectorAll(`.tab-pane:not(#${_id})`).forEach(pane => {
//       pane.classList.remove('show', 'active')
//     })
//     document.getElementById(_id).classList.add('show', 'active');
//   }
// }

// navTabs.forEach(tab => tab.addEventListener('click', switchTab))

/**
 * Scroll To Top
 */
const scrollToTopButton = document.querySelector('.scroll-top');
scrollToTopButton.onclick = () => window.scroll({ top: 0, left: 0 })

window.addEventListener('scroll', () => {
  window.pageYOffset < 800
    ? scrollToTopButton.classList.remove('visible', 'fade')
    : scrollToTopButton.classList.add('visible')
})

/**
 * Edit Food Modal & Delete Buttons Functionality
 */
const foodEditButtons = document.querySelectorAll('.food-edit'),
      foodDeleteButtons = document.querySelectorAll('.food-delete'),
      foodEditModal = document.querySelector('.modal.foodEditModal'),
      foodEditCloseModal = document.querySelector('.close-modal.foodEditModal'),
      foodEditForm = document.getElementById('foodEditForm'),
      foodDeleteForm = document.getElementById('foodDeleteForm');

if (foodEditModal) {
  foodEditButtons.forEach((button, index) => button.addEventListener('click', e => {
    foodEditModal.classList.add('active');
    foodEditModal.parentElement.classList.add('active');
  
    let foodData = foodEditButtons[index].dataset,
        foodEditUrl = foodEditForm.action,
        newUrl = foodEditUrl.substr(0, foodEditUrl.lastIndexOf('/') + 1) + foodData.foodId + '?_method=PUT';
  
    foodEditForm.action = newUrl, foodDeleteForm.action = newUrl;
    document.querySelector('[name="name"]:not([add])').value = foodData.foodName;
    document.querySelector('[name="description"]:not([add])').value = foodData.foodDescription;
    document.querySelector('[name="price"]:not([add])').value = foodData.foodPrice;
    document.querySelector('[name="quantity"]:not([add])').value = foodData.foodQuantity;
  }))
  
  foodEditCloseModal.addEventListener('click', () => {
    foodEditModal.classList.remove('active');
    foodEditModal.parentElement.classList.remove('active');
  })
  
  foodDeleteButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      let id = foodDeleteButtons[index].dataset.foodId,
          foodDeleteUrl = foodDeleteForm.action,
          newUrl = foodDeleteUrl.substr(0, foodDeleteUrl.lastIndexOf('/') + 1) + id + '?_method=DELETE';
  
      foodDeleteForm.action = newUrl, foodDeleteForm.submit()
    })
  })  
}

/**
 * Add Food Modal Functionality
 */
const foodAddModal = document.querySelector('.modal.foodAddModal'),
      foodAddCloseModal = document.querySelector('.close-modal.foodAddModal'),
      addFoodButton = document.querySelector('.add-food');

if (foodAddModal) {
  addFoodButton.addEventListener('click', () => {
    foodAddModal.classList.add('active');
    foodAddModal.parentElement.classList.add('active');
  })
  
  foodAddCloseModal.addEventListener('click', () => {
    foodAddModal.classList.remove('active');
    foodAddModal.parentElement.classList.remove('active');
  })
}

/**
 * Review Edit & Delete Functionality
 */
const reviewEditButtons = document.querySelectorAll('.review-edit'),
      reviewEditModal = document.querySelector('.modal.reviewEditModal'),
      reviewEditCloseModal = document.querySelector('.close-modal.reviewEditModal'),
      reviewEditForm = document.getElementById('reviewEditForm'),
      reviewDeleteForm = document.getElementById('reviewDeleteForm');

if (reviewEditModal) {
  reviewEditButtons.forEach((button, index) => button.addEventListener('click', () => {
    reviewEditModal.classList.add('active');
    reviewEditModal.parentElement.classList.add('active');
  
    let reviewData = reviewEditButtons[index].dataset,
        reviewEditUrl = reviewEditForm.action,
        newUrl = reviewEditUrl.substr(0, reviewEditUrl.lastIndexOf('/') + 1) + reviewData.reviewId + '?_method=PUT';
  
    reviewEditForm.action = newUrl; // reviewDeleteForm.action = newUrl;
    document.querySelector('[name="title"][edit]').value = reviewData.reviewTitle;
    document.querySelector('[name="content"][edit]').value = reviewData.reviewContent;
    document.querySelectorAll('[name="rating"][edit]')[10 - reviewData.reviewRating].checked = true
  }))
  
  reviewEditCloseModal.addEventListener('click', () => {
    reviewEditModal.classList.remove('active');
    reviewEditModal.parentElement.classList.remove('active');
  })
  
  // reviewDeleteButtons.forEach((button, index) => {
  //   button.addEventListener('click', () => {
  //     let id = reviewDeleteButtons[index].dataset.reviewId,
  //         reviewDeleteUrl = reviewDeleteForm.action,
  //         newUrl = reviewDeleteUrl.substr(0, reviewDeleteUrl.lastIndexOf('/') + 1) + id + '?_method=DELETE';
  
  //     reviewDeleteForm.action = newUrl, reviewDeleteForm.submit()
  //   })
  // })
}

/**
 * Add Review Modal Functionality
 */
const reviewAddModal = document.querySelector('.modal.reviewAddModal'),
      reviewAddCloseModal = document.querySelector('.close-modal.reviewAddModal'),
      addReviewButton = document.querySelector('.add-review');

if (reviewAddModal) {
  addReviewButton.addEventListener('click', () => {
    reviewAddModal.classList.add('active');
    reviewAddModal.parentElement.classList.add('active');
  })
  
  reviewAddCloseModal.addEventListener('click', () => {
    reviewAddModal.classList.remove('active');
    reviewAddModal.parentElement.classList.remove('active');
  })
}


/**
 * Cart Remove Functionality
 */
const cartRemoveButtons = document.querySelectorAll('.cart-remove');
const cartTotal = document.querySelector('.cart-total');

if (cartRemoveButtons) {
  cartRemoveButtons.forEach((button, index) => button.addEventListener('click', () => {
    const itemId = cartRemoveButtons[index].dataset.id;
    const itemExists = cart.basket.filter(item => item.itemId === itemId)

    if (itemExists) cart.removeItem(itemId, -1)

    cartCount.innerText = cart.count()
    cartTotal.innerText = cart.total().toLocaleString()
    setCookie('cart', JSON.stringify(cart.basket), 7)
    
    cartRemoveButtons[index].closest('tr').remove();
  }))
}


/**
 * Checkout Modal Functionality
 */
const checkoutModal = document.querySelector('.modal.checkoutModal'),
      checkoutCloseModal = document.querySelector('.close-modal.checkoutModal'),
      checkoutButton = document.querySelector('.checkout'),
      payButton = document.querySelector('.pay');

if (checkoutModal) {
  checkoutButton.addEventListener('click', () => {
    checkoutModal.classList.add('active');
    checkoutModal.parentElement.classList.add('active');

    payButton.innerText = `Pay ₦${cart.total().toLocaleString()}`;
  })
  
  checkoutCloseModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
    checkoutModal.parentElement.classList.remove('active');
  })
}