import { Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "./login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../shared/services/auth.service";
import { first } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Location } from '@angular/common';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild('script', { static: true }) script: ElementRef;


  loginForm: FormGroup;
  submitted = false;
  reset = false;
  rememberChecked = false;
  fieldTextType: boolean;
  loading = false;
  returnUrl: string;
  error = "";
  telegramRequested = false;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private zone: NgZone

  ) {
    // redirect to home if already logged in
    if (this.auth.userValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    this.init();
    this.initLoginForm();
    this.convertToScript();
  }
  ngAfterViewInit() {
    this.convertToScript();
    if (this.auth.userValue) {
      this.router.navigate(['account']);
    }
  }


  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        Validators.maxLength(100),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/
        ),
        Validators.maxLength(100),
      ]),
    });

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "tutorial";
  }

  login() {

    this.submitted = true;
    if (this.loginForm.valid) {
      // document.getElementById('spinner').style.display = 'block';
      const control = this.loginForm.controls;
      const data = {
        email: control.email.value,
        password: control.password.value,
      };
      this.auth
        .login(data)
        .pipe(first())
        .subscribe({
          next: () => {

            this.router.navigate([this.returnUrl]);
          },
          error: (error) => {
            this.error = error;
            this.toastr.error(error);

            this.loading = false;
          },
        });
    } else {
      this.toastr.error("Enter your login and password");

      return;
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  onClick(event) {
    console.log(event.target.checked, "on click");
    this.rememberChecked = event.target.checked;
    if (this.rememberChecked) {
      localStorage.setItem("pwd", this.loginForm.value.password);
      localStorage.setItem("email", this.loginForm.value.email);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("pwd");
    }
  }
  onEmail() {
    if (localStorage.getItem("email") == this.loginForm.controls.email.value) {
      this.loginForm.patchValue({
        password: localStorage.getItem("pwd"),
      });
    }
  }
  convertToScript() {

    if (this.telegramRequested != false) {
      return;
    }

    this.telegramRequested = true;

    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?2';
    script.setAttribute('data-telegram-login', environment.telegramBot);
    script.setAttribute('data-size', 'large');
    // script.setAttribute('data-auth-url', `${environment.apiUrl}/auth/telegram`)
    // Callback function in global scope
    script.setAttribute('data-onauth', 'loginViaTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    element.parentElement.replaceChild(script, element);
  }

  init() {
    window['loginViaTelegram'] = loginData => this.loginViaTelegram(loginData);
  }

  private loginViaTelegram(loginData) {
    this.submitted = true;


    loginData.id = String(loginData.id)
    // If the login should trigger view changes, run it within the NgZone.
    this.auth
      .telegramLogin(loginData)
      .pipe(first())
      .subscribe({
        next: () => {

          this.zone.run(() => {
            this.location.replaceState('/');
            this.router.navigateByUrl(this.returnUrl);
          });

        },
        error: (error) => {
          this.error = error;
          this.toastr.error(error);
          this.loading = false;
        },
      });
    // this.ngZone.run(() => process(loginRequest));
  }
}
