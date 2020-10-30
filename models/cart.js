/**
 * Cart acts as a central store for items & it has methods
 * for performing CRUD-like operations on the items
 * @class
 */
class Cart{
  constructor(cart) {
    this.basket = cart || [];
  }

  /**
   * Adds an item to the cart
   * @param {String} itemId The unique ID of the item you want to add to cart
   * @param {String} itemName The item you want to add to cart
   * @param {Number} quantity Number of the item you want to add
   * @param {Number} price Price of the item
   */
  addItem(itemId, itemName, quantity, price) {
    if (!itemId || !itemName || !quantity || !price)
      return console.error('Error :>> One or more arguments are missing!')

    if (typeof itemId !== 'string' || typeof itemName !== 'string' || typeof quantity !== 'number' || typeof price !== 'number')
      return console.warn('Warning :>> One or more of the arguments have an invalid data type')

    let itemExists = this.basket.filter(item => item.itemId === itemId)

    itemExists.length
      ? console.error('Error :>> Item is already in cart!')
      : this.basket.push({ itemId, itemName, quantity, price })

    return this;
  }


  /**
   * Updates an item in the cart
   * @param {String} itemId The unique ID of the item you want to add to cart
   * @param {Number} value The new value to replace the former
   */
  updateItem(itemId, value) {
    if (!itemId || !value)
      return console.error('Error :>> One or more arguments are missing!')

    if (typeof itemId !== 'string' || typeof value !== 'number')
      return console.warn('Warning :>> One or more of the arguments have an invalid data type')

    let itemExists = this.basket.filter(item => item.itemId === itemId)

    if (itemExists.length) {
      const itemIndex = this.basket.map(item => item.itemId).indexOf(itemId)
      this.basket[itemIndex].quantity = value
    } else {
      console.error('Error :>> Item is not in cart!')
    }

    return this;
  }


  /**
   * Removes some or all of an item in a cart
   * @param {String} itemId The unique ID of the item you want to add to cart
   * @param {Number} quantity The quantity of the item you want to remove
   */
  removeItem(itemId, quantity) {
    if (!itemId || !quantity)
      return console.error('Error :>> One or more arguments are missing!')

    if (typeof itemId !== 'string' || typeof quantity !== 'number')
      return console.warn('Warning :>> One or more of the arguments have an invalid data type')

    let itemExists = this.basket.filter(item => item.itemId === itemId)

    if (itemExists.length) {
      const itemIndex = this.basket
        .map(item => item.itemId.toLowerCase())
        .indexOf(itemId.toLowerCase())
        
      const itemQuantity = this.basket[itemIndex].quantity

      if (itemQuantity === quantity || quantity === -1) {
        this.basket.splice(itemIndex, 1)
      } else if (itemQuantity > quantity) {
        this.basket[itemIndex].quantity -= quantity
      } else {
        console.error(`Error :>> The quantity argument must be less than or equal to ${itemQuantity}`)
      }
    } else {
      console.error('Error :>> Item is not in cart!')
    }

    return this;
  }

  /**
   * Returns the total number of items in the cart
   * @returns {Number} count
   */
  count() {
    return this.basket
      .reduce((total, item) => total + item.quantity, 0)
  }

  /**
   * Returns the total price of items in the cart
   * @returns {Number} total
   */
  total() {
    return this.basket
      .reduce((total, item) => total + (item.quantity * item.price), 0)
  }

  /**
   * Returns true if the price is equal or greater than the total price of items in the cart
   * @param {Number} cash The amount tendered
   */
  checkout(cash) {
    return this.total() && cash >= this.total()
      ? cash - this.total()
      : false
  }
}

module.exports = Cart;