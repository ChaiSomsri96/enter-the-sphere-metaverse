import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { LootboxComponent } from './lootbox.component';
import { MarketHomeComponent } from './market-home/market-home.component';
import { PurchaseSuccessComponent } from './purchase-success/purchase-success.component';


const routes: Routes = [
  {
    path: '',
    component: LootboxComponent,
    children: [
      {
        path: '',
        component: MarketHomeComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'success',
        component: PurchaseSuccessComponent
      }
    ]
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LootboxRoutingModule { }
