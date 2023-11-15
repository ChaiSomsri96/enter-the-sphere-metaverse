import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { ToastrService } from 'ngx-toastr';
import { UserCardsService } from '../user-cards.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  walletForm: any;
  fieldTextType: boolean;
  wallet: any ;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  constructor(private toastr: ToastrService, private userCardsService: UserCardsService, private router: Router) { }

  ngOnInit(): void {
    this.walletForm = new FormGroup({
      slpAddress: new FormControl(),
      privateKey: new FormControl()
    })
    this.getUserWallet();
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success("copy to clipboard")
  }

	toBalanceBCH() {
		this.router.navigate(['/account/balance']);
	}

  giftTo() {
    this.toastr.success("Feature coming soon.")
  }
  getUserWallet(){
    this.userCardsService.getUserWallet().subscribe(res => {
      this.wallet = res;
      this.walletForm.patchValue({
        slpAddress: this.wallet.slpAddress,
        privateKey: this.wallet.privateKey
      })
    })
  }
}
