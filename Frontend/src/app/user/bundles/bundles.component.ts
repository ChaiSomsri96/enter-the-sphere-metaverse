import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BundlesService } from '../bundles.service';
import { UserCardsService } from "../user-cards.service"
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  openedBundles: any = [];
  closedBundles: any = [];
  userCards: any = [];
  wallet: any;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = 'https://www.techiediaries.com/';
  walletForm: any;
  fieldTextType: boolean;

  constructor(private bundles: BundlesService, private router: Router, private userCardsService: UserCardsService, private toastr: ToastrService, private auth: AuthenticationService) {

  }

  ngOnInit(): void {
    this.bundles.getAllCards().subscribe(res => {
      this.closedBundles = res;
      console.log('bundles', res)
    })
    this.bundles.getAllOpenedCards().subscribe(res => {
      this.openedBundles = res;
      console.log('bundles', res)
    })
    this.walletForm = new FormGroup({
      slpAddress: new FormControl(),
      privateKey: new FormControl()
    })

    this.getCards();
  }

  openBox(id) {
    this.router.navigate(['account/bundles', id, 'open'])

    //report mission progress. should it be in open bundle component?
    var params = new URLSearchParams(window.location.search);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://staging.enter-the-sphere.com/api/missionsv1/progress', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      counter: `event.open_pack`,
      user_id: this.auth.userValue.uuid
    }));
  }

  viewBox(id) {
    this.router.navigate(['account/bundles', id, 'view'])
  }

  getCards() {
    this.userCardsService.getUserCards().subscribe(res => {
      this.userCards = res;
    })
  }

  addCardforSale(id) {
    this.router.navigate(['account/card-sell', id]);
  }

  withdrawCard(id) {
    this.router.navigate(['account/withdraw', id]);
  }

  getUserWallet() {
    this.userCardsService.getUserWallet().subscribe(res => {
      this.wallet = res;
      this.walletForm.patchValue({
        slpAddress: this.wallet.slpAddress,
        privateKey: this.wallet.privateKey
      })
    })
  }

  onOpenAnotherPack() {
    if (this.closedBundles.length > 0) {
      this.openBox(this.closedBundles[0].uuid);


    }
    //		this.router.navigate(['/lootbox']);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  copyMessage(val: string) {
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

  giftTo() {
    this.toastr.success("Withdrawals coming soon");
  }

  onGotoDeckApp() {
    this.userCardsService.linkDeckApp();
  }
}
