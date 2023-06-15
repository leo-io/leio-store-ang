import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  //properties for pagination control

  thePageNumber: number = 1;
  totalPages: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  itemsPerPage: number = 10;
  pageRangeDisplayed: number = 5;
  previousCategoryId: number = 1;
  previousKeyword: string ="";

  constructor(private productService: ProductService, private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }


  }
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if keyword is different than previous set page number to 1

    if (theKeyword != this.previousKeyword) {
      this.thePageNumber = 1;
     
    }
    this.previousKeyword = theKeyword;

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize,theKeyword).subscribe(this.processResult());
    //this.productService.searchProducts(theKeyword).subscribe(data => { this.products = data });
  }
  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  


  handleListProducts() {
    //check if id category is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {

      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    //Check to see if we have a different category id than the previous
    //Angular will reuse the component if it is already being used


    //if we have a different category id than the previous category
    // set the current thePageNumber back to 1

    if (this.currentCategoryId != this.previousCategoryId) {
      this.thePageNumber = 1;

    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductlistPaginate( this.thePageNumber -1 , 
                                                this.thePageSize,
                                                this.currentCategoryId).subscribe(this.processResult());
                                                  
    

  }

  addToCart(theProduct: Product) {
    console.log(`Adding to Cart ${theProduct.name}`);
    const theCartItem = new CartItem (theProduct);
    this.cartService.addToCart(theCartItem);

    }
    
}
