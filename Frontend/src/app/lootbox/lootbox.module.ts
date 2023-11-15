import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LootboxRoutingModule } from './lootbox-routing.module';
import { LootboxComponent } from './lootbox.component';
import { MarketHomeComponent } from './market-home/market-home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PurchaseSuccessComponent } from './purchase-success/purchase-success.component';
import { FormsModule } from '@angular/forms';
import { PurchaseCompletedComponent } from './purchase-completed/purchase-completed.component';


@NgModule({
  declarations: [LootboxComponent, MarketHomeComponent, CheckoutComponent, PurchaseSuccessComponent, PurchaseCompletedComponent],
  imports: [
    CommonModule,
    LootboxRoutingModule,
    FormsModule
  ]
})
export class LootboxModule { }
