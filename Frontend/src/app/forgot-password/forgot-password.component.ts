import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm:FormGroup;
  submitted=false;

  constructor(private forgotService : ForgotPasswordService) { }

  ngOnInit(): void {
    this.forgotForm=new FormGroup({
      email : new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(100)])
    });
  }

  forgot(){
    this.submitted=true;
    if(this.forgotForm.valid){
      const control = this.forgotForm.controls;
      var data ={
        email : control.email.value
      }
      this.forgotService.forgot(data).subscribe(success=>{
        console.log(success);
      },
      (error)=>{
        console.log(error,"Error in forgot");
      });
  
    }

    
  }

}
