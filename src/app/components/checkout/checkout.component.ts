import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  emailRegex: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkOutService: CheckoutService,
    private router: Router) {

  }

  ngOnInit() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    // javascript months are zero based
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    )

    //populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )

    

    this.reviewCartDetails()

  }
  reviewCartDetails() {
    
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity);
    
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice);
  }


  onSubmit(): void {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // setup order

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get the cart items 
    let cartItems: CartItem[] = this.cartService.cartItems;
    
    //create the order items from Cart Items
    
    let orderItems: OrderItem[] = [];
    
    for (let cartItem of cartItems) {
      let orderItem = new OrderItem(cartItem);
      orderItems.push(orderItem);
    }
    // setup purchase
    let purchase = new Purchase();

    // populate purchase DTO with customer and address

    purchase.customer = this.checkoutFormGroup.get('customer').value;

    purchase.shippingAddress = this.checkoutFormGroup.get('shippingAddress').value;
    const shippingState: State = (JSON.parse(JSON.stringify(purchase.shippingAddress.state)));
    const shippingCountry: Country = (JSON.parse(JSON.stringify(purchase.shippingAddress.country)));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase DTO with billing address
    if (this.checkoutFormGroup.get('billingAddress').value.street != '') {
      purchase.billingAddress = this.checkoutFormGroup.get('billingAddress').value;
      const billingState: State = (JSON.parse(JSON.stringify(purchase.billingAddress.state)));
      const billingCountry: Country = (JSON.parse(JSON.stringify(purchase.billingAddress.country)));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;
    }

    
    purchase.order = order;
    purchase.orderItems = orderItems;
    
    // create the purchase
    this.checkOutService.placeOrder(purchase).subscribe(
      {
        next: response => { 
          alert('Order Successfully Placed.\n Order tracking number: ' + response.orderTrackingNumber);
          this.clearCart();
          
        }, // success
        error: err => { 
          alert(`There was an error processing your order:\n${err.message}`);
          console.log(err.message);
          
        
        } // exception
      }
    );
    
    
    
    
    
    
  

  }
  clearCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  copyShippingAddressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates; // bugfix for states when copy shipping add

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];

    }
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName); //get group of the form
    const countryCode = formGroup.value.country.code; // get the selected country code

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        //select the first state
        formGroup.get('state').setValue(data[0]);

      })
  }

}
