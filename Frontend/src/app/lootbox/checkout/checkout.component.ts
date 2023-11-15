import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js'; // this is typescript
import { LootboxService } from '../lootbox.service';
import { AuthenticationService } from 'src/app/shared/services/auth.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  purchaseBox: boolean = false;
  quantity: number;
  totalPrice: number;
  totalTax:number;
  finalPrice: number;
  stripe:any;
  stripePromise: any;
  userId:any;

  constructor(private lootbox: LootboxService, private auth: AuthenticationService) { }

  ngOnInit(): void {
     this.stripePromise = loadStripe(environment.stripe)
    .then(res => {
      this.stripe = res;
    });

    this.lootbox.purchaseValue.subscribe(res => {
      this.quantity = res;
      this.totalPrice = this.quantity * 2;
      this.totalTax = this.quantity * 0.40;
      this.finalPrice = this.totalPrice + this.totalTax;
    })
    this.auth.user.subscribe(res => {
      this.userId = res.uuid;
      console.log('user', this.userId)
    })
  }

  togglePurchase(){
    this.purchaseBox = !this.purchaseBox;
  }

  updateCart() {

    this.totalPrice = this.quantity * 2;
    this.totalTax = this.quantity * 0.40;
    this.finalPrice = this.totalPrice + this.totalTax;
  }

	coinpaymentsPurchase(){
		fetch(`${environment.apiUrl}/payments/crypto/create-payment-session`,
					{
						method: 'POST', 
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userId: this.userId,
							quantity: this.quantity,
						})
					}).then((response)=>response.json())
					.then((payload: any)=>{
						document.location.href=payload.checkout_url
					})
	}

  stripePurchase() {
    console.log('userad', this.userId)
    // Create an instance of the Stripe object with your publishable API key
    console.log('base', environment.apiUrl)
      fetch(
        `${environment.apiUrl}/payments/stripe/create-payment-session`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: this.quantity,
            userId: this.userId,
          }),
        }
      )
        .then(function (response) {
          console.log("response", response);
          return response.json();
        })
        .then( (session: any) => {
          return this.stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function (result) {
          // If redirectToCheckout fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using error.message.
           });
  }

}
