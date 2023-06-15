import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];

  //Observable pattern publish the cart totals to all subscribers
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

//  storage: Storage = sessionStorage;
  storage: Storage = localStorage;


  constructor() { 
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.cartItems = data;
      this.computeCartTotals();
  
    }
  }

  persistCartItems() { 
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }


  addToCart(theCartItem: CartItem) {

    //check if the item is already in the cart
    let alreadyInCart: boolean = false;
    let existingCartItem: CartItem | undefined;



    if (this.cartItems.length > 0) {
      //find the item in the cart based on the identifier

      //refactored to the code below 
      //for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);


      //check if it is found in the cart
      alreadyInCart = (existingCartItem != undefined);
    }

    if (alreadyInCart) {  
      //update the quantity
      existingCartItem!.quantity++;
    }else {
      //add the item to the cart
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();


   
  }
  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;
    for (let tempCartItem of this.cartItems) {
          totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
          totalQuantityValue += tempCartItem.quantity;
        }
    //publish the total price and quantity values to the subscribers

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
    
    this.persistCartItems();  
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.unitPrice * tempCartItem.quantity;
      console.log(`name: ${tempCartItem.name }, quantity=${tempCartItem.quantity}, unit price: ${tempCartItem.unitPrice}, subtotalprice: ${subTotalPrice  }`);
      
    }
    console.log(`total price: ${totalPriceValue.toFixed(2)}, total quantity: ${totalQuantityValue}`);
    console.log(`================================================`);

   
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity --;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
      else{
        this.computeCartTotals();
      }    
    }

  remove(theCartItem: CartItem) {
    //get index of the cart item
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)

    if (itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
  

}
