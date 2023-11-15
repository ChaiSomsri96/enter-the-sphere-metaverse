import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxPaginationModule } from "ngx-pagination";
import { CommonFunctionsService } from "./commonService/rejex.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { CardspageComponent } from "./cardspage/cardspage.component";
import { MarketComponent } from "./market/market.component";
import { CardDetailComponent } from "./card-detail/card-detail.component";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { TooltipModule } from "ng2-tooltip-directive";
import { ModalModule } from "ngx-bootstrap/modal";
import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { ErrorInterceptor } from "./helpers/error.interceptor";
import { appInitializer } from "./helpers/app.initializer";
import { AuthenticationService } from "./shared/services/auth.service";
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from "./shared/loader/loader.service";
import { LoaderInterceptor } from "./helpers/loader.interceptor";
import { FaqsComponent } from './faqs/faqs.component';
import { EventsComponent } from './events/events.component';
import { TutorialComponent } from "./tutorial/tutorial.component";

import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

import { environment } from "../environments/environment";
import { RewardclaimedComponent } from './rewardclaimed/rewardclaimed.component';

Sentry.init({
  dsn: environment.sentryDsn,
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", environment.apiUrl.replace("https://", "").replace("http://", "").replace("/api/v1", "")],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  tracesSampleRate: environment.sentryTracesSampleRate,
});


@NgModule({
  declarations: [
    AppComponent,
    CardspageComponent,
    MarketComponent,
    CardDetailComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    FooterComponent,
    VerifyEmailComponent,
    AlertComponent,
    LoaderComponent,
    FaqsComponent,
    EventsComponent,
    TutorialComponent,
    RewardclaimedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDialogModule,
    TooltipModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
      closeButton: true,
    }),
    NgxQRCodeModule

  ],
  exports: [],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthenticationService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CommonFunctionsService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
