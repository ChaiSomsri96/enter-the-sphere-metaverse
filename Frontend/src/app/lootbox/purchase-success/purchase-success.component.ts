import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchase-success',
  templateUrl: './purchase-success.component.html',
  styleUrls: ['./purchase-success.component.scss']
})
export class PurchaseSuccessComponent implements OnInit {
  id: any;
  data:any;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe( async (res) => {
      console.log('ad', res['id'])
      const data = await fetch(`${environment.apiUrl}/payments/stripe/payment-session?id=` + res['id']);
       setTimeout(()=> {
      this.router.navigate(['account'])

     }, 3000)
    });

    console.log('data')

  }

}
