import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  ngOnInit(): void {
    this.updateCartStatus();
  }

  constructor(private cartService: CartService){

  }
  updateCartStatus() {
    //subscribe to cart total price
    this.cartService.totalPrice.subscribe((data: number) => this.totalPrice = data);
    

    //subscribe to cart total quantity
    this.cartService.totalQuantity.subscribe((data: number) => this.totalQuantity = data);
  }

 

}
