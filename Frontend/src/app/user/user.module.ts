import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { BundlesComponent } from './bundles/bundles.component';
import { ProfileComponent } from './profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OpenBundleComponent } from './open-bundle/open-bundle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ViewBundleComponent } from './view-bundle/view-bundle.component';
import { WalletComponent } from './wallet/wallet.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { BalanceComponent } from './balance/balance.component';
import { SellCardComponent } from './sell-card/sell-card.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [UserComponent, BundlesComponent, ProfileComponent, OpenBundleComponent, ViewBundleComponent, WalletComponent, WithdrawComponent, SellCardComponent, BalanceComponent],
  imports: [
    UserRoutingModule,
    CommonModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
		FormsModule,
  ]
})
export class UserModule { }
