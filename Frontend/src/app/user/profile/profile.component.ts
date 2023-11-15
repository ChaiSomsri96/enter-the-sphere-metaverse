import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/auth.service';
import { UserService } from '../user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('script', {static: true}) script: ElementRef;


  updateForm: any;
  submitted: boolean = false;
  user: any;
  userProfiles: any;

	telegramRequested = false;

  constructor(private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
    this.user =  this.authService.userValue;
    console.log('user', this.user)


    this.updateForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      gender: this.user.gender
    })
    if(this.user.telegramId){
      this.userService.getUserProfilePic(this.user.telegramId).subscribe(res => {
        ;
        console.log('res', res)
      })
    }else{
    	this.convertToScript();
		}
  }


	ngAfterViewInit() {
		if (this.user.telegramId){
		}else{
			this.convertToScript();
		}
	}

	convertToScript() {
		if (this.telegramRequested!=false){
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
    script.setAttribute('data-onauth', 'connectTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    element.parentElement.replaceChild(script, element);

		window['connectTelegram']=loginData=>this.connectTelegram(loginData);
	}

	private connectTelegram(loginData){
		this.userService.connectTelegram(loginData).subscribe(res=>{
			window.location.reload();
		})
	}

    initForm(){
    this.updateForm = new FormGroup({
      firstName : new FormControl(),
      lastName : new FormControl(),
      email : new FormControl('',[Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(100)]),
      gender: new FormControl()
      // mobileNumber : new FormControl('',[Validators.required,Validators.pattern("^(\\+[0-9][0-9]-?)[0-9]{7,15}$")]),

    });
  }

  update(){

  }
}
