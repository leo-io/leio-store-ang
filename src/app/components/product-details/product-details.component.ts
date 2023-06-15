import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  product!: Product;
  
    constructor(private productService: ProductService,
                private cartService: CartService,
                private route: ActivatedRoute) {
                }
  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.handleProductDetails();

    })
  }


  handleProductDetails() {
    const idParam = this.route.snapshot.paramMap.get('id');
 
    if (idParam !== null) {
       const theProductId = +idParam;
 
       this.productService.getProduct(theProductId).subscribe(
          data => {
             this.product = data;
          }
       );
    } else {
       // Handle the case when the 'id' parameter is missing or null
    }
 }

 addToCart(){

  console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}}`);
  const theCartItem = new CartItem(this.product);
  this.cartService.addToCart(theCartItem);
 }
 
}
