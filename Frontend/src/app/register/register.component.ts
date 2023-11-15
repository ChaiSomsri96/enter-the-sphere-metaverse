import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { RegisterService } from './register.service';
import { ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../shared/services/auth.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('script2', {static: true}) script: ElementRef;

  registerForm:FormGroup;
  submitted=false;
  fieldTextType: boolean;
  loading = false;
  returnUrl: string;
  error = "";
	telegramRequested = false;

  constructor( private registerService : RegisterService,
               private router : Router,
               private toastr : ToastrService, private auth: AuthenticationService,
               private route: ActivatedRoute,
               private location: Location,
               private zone: NgZone
               ) {
                if (this.auth.userValue) {
                  this.router.navigate(["/"]);
                }
               }

  ngOnInit(): void {
    this.initForm();
    this.init();

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "account";

    this.convertToScript();
  }
  ngAfterViewInit() {
    this.convertToScript();
    if (this.auth.userValue) {
      this.router.navigate(['account']);
    }
  }

  initForm(){
    this.registerForm = new FormGroup({
      firstName : new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z]+[\-'\s]?[a-zA-Z ]+$")]),
      lastName : new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z]+[\-'\s]?[a-zA-Z ]+$")]),
      email : new FormControl('',[Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(100)]),
      telegramId: new FormControl(),
      // mobileNumber : new FormControl('',[Validators.required,Validators.pattern("^(\\+[0-9][0-9]-?)[0-9]{7,15}$")]),
      password : new FormControl('',[Validators.required,Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/), Validators.maxLength(100)]),
      confirmPassword : new FormControl('',[Validators.required,Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/), Validators.maxLength(100)]),
      active: new FormControl('', Validators.required)
    });
  }

  register(){

    this.submitted = true;
    if(this.registerForm.valid){
      const control = this.registerForm.controls;
      const obj = {
        firstName: control.firstName.value,
        lastName: control.lastName.value,
        email: control.email.value,
        password: control.password.value,
      }
      this.registerService.register(obj).subscribe(success=>{
        this.submitted = false;
        this.toastr.success("Successfully registered");
        this.router.navigate(["/login"]);
        console.log(success,"register Response");
      },
      (error)=>{
        this.toastr.error(error["error"].message);
        console.log(error,"Register Error");
      });
    } else {

      return;
    }

  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  convertToScript() {

		if (this.telegramRequested!=false){
			return;
		}

		this.telegramRequested=true;

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

    loginData.id = String(loginData.id)
    // If the login should trigger view changes, run it within the NgZone.
    this.auth
    .telegramLogin(loginData)
    .pipe(first())
    .subscribe({
      next: () => {
        this.zone.run(() => {
          this.location.replaceState('/');
          this.router.navigateByUrl(this.returnUrl);      });
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
