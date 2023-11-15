import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BundlesComponent } from './bundles/bundles.component';
import { OpenBundleComponent } from './open-bundle/open-bundle.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user.component';
import { ViewBundleComponent } from './view-bundle/view-bundle.component';
import { WalletComponent } from './wallet/wallet.component';
import { BalanceComponent } from './balance/balance.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { SellCardComponent } from './sell-card/sell-card.component';

const routes: Routes = [{
  path: '',
  component: UserComponent,
  children: [
    {
      path: '',
      component: BundlesComponent
    },
    {
      path: 'bundles/:id/view',
      component: ViewBundleComponent
    },
    {
      path: 'bundles/:id/open',
      component: OpenBundleComponent
    },
    {
      path: "profile",
      component: ProfileComponent
    },
    {
      path: "wallet",
      component: WalletComponent
    },
		{
			path: "balance",
			component: BalanceComponent
		},
		{
			path: "withdraw/:id",
			component: WithdrawComponent
		},
		{
			path: "card-sell/:id",
			component: SellCardComponent
		},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
