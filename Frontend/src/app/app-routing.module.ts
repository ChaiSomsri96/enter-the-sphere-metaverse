import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardspageComponent } from './cardspage/cardspage.component';
import { MarketComponent } from './market/market.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './helpers/auth.guard';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FaqsComponent } from './faqs/faqs.component';
import { EventsComponent } from './events/events.component';

const routes: Routes = [
  { path: "", pathMatch: 'full', component: CardspageComponent },
  { path: "cards", pathMatch: 'full', component: CardspageComponent },
  { path: "tutorial", pathMatch: 'full', component: TutorialComponent },
  { path: "market", pathMatch: 'full', component: MarketComponent },
  { path: "faqs", pathMatch: 'full', component: FaqsComponent },
  { path: "events", pathMatch: 'full', component: EventsComponent },
  { path: "login", pathMatch: 'full', component: LoginComponent },
  { path: "register", pathMatch: 'full', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'tutorial', component: TutorialComponent },

  { path: "forgot-password", pathMatch: 'full', component: ForgotPasswordComponent },
  { path: "reset-password", pathMatch: 'full', component: ResetPasswordComponent },
  { path: "card-detail/:id", pathMatch: 'full', component: CardDetailComponent },
  {
    path: 'lootbox',
    loadChildren: () => import("./lootbox/lootbox.module").then(m => m.LootboxModule)
  },
  {
    path: 'account',
    loadChildren: () => import("./user/user.module").then(m => m.UserModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
