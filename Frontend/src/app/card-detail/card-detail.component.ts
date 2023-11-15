import { Component, OnInit, TemplateRef } from '@angular/core';
import { CardDetailService } from './card-detail.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CommonFunctionsService } from "../commonService/rejex.service";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {

  modalRef: BsModalRef;
  editForm: FormGroup;
  cardId;
  details;
  shortDescription;
  userId;
  account;
  tradeList;
  page: any = 1;
  totalPages;
  pageView;
  allCardsData: any = [];
  isLogin = false;
  submitted = false;
  currentToken: any;

  config = {
    class: 'modal-lg',
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: false,
  };

  constructor(
    private cardDetailService: CardDetailService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private commonFunctionsService: CommonFunctionsService
  ) {}

  ngOnInit(): void {
    window.scrollTo({
      top: 1,
      behavior: 'smooth',
    });

    this.cardId = this.route.snapshot.params['id'];
    this.cardDetails();
    if (localStorage.getItem('admin-token')) {
      this.isLogin = true;
      this.getAccountInfo();
    } else {
      this.isLogin = false;
    }
    this.initEdit();
    this.Allcards();
    // this.getCardforSale()
    // this.tradeHistory();
  }

  ngDoCheck() {
    if (this.cardId && this.cardId != this.route.snapshot.params['id']) {
      location.reload();
    }
  }

  initEdit() {
    this.editForm = new FormGroup({
      price: new FormControl('', [
        Validators.pattern(this.commonFunctionsService.onlyNumber),
      ]),
    });
  }
  getAccountInfo() {
    this.cardDetailService.accountInfo().subscribe(
      (success) => {
        this.account = success['results'];
        this.userId = this.account[0].user_id;
        console.log(this.account, 'account info');
        this.tradeHistory();
      },
      (error) => {
        console.log(error, 'error account');
      }
    );
  }

  cardDetails() {
    this.cardDetailService.getDetails(this.cardId).subscribe(
      (success) => {
        this.details = success;
        this.currentToken = `https://simpleledger.info/token/${this.details.tokenId}`
        if (this.details.desc.length > 50) {
          this.shortDescription = this.details.desc.slice(0, 50) + '...';
        } else {
          this.shortDescription = this.details.desc;
        }
        console.log(success, 'response');
      },
      (error) => {
        console.log(error, 'Error');
      }
    );
  }

  // getCardforSale() {
  //   this.cardDetailService.getCardforSale(this.cardId).subscribe(success => {
  //     console.log(success, "response");
  //   },
  //     (error) => {
  //       console.log(error, "Error");
  //     }
  //   );
  // }

  openModal(template: TemplateRef<any>) {

	return document.location.href='/account';//environment.NFTMarketplace;
    if (!this.isLogin) {
      this.toastr.error('Please login!');
      this.router.navigateByUrl('/login');
      return;
    }
    this.editForm.patchValue({
      price: this.details?.current_price,
    });
    this.modalRef = this.modalService.show(template, this.config);
  }

  closeModal() {
    this.modalRef.hide();
    this.submitted = false;
    this.editForm.reset();
  }

  buy() {
    let temp = this.currentToken
    temp = temp.replace('https://simpleledger.info/token/','')
    window.open(`https://www.juungle.net/#/collection/${temp}`, '_blank').focus();
		// return document.location.href=environment.NFTMarketplace;

    // if (!this.isLogin) {
    //   this.toastr.error('Please login!');
    //   this.router.navigateByUrl('/login');
    //   return;
    // }
    var data = {
      quantity: '1',
    };
    this.toastr.success('Marketplace coming soon');

    // this.cardDetailService.buy(this.cardId, data).subscribe(
    //   (success) => {
    //     this.tradeHistory();
    //     this.toastr.success('Successfully card purchased');
    //     // this.router.navigate(['/cards']);
    //     console.log(success, 'buy response');
    //   },
    //   (error) => {
    //     this.toastr.error(error['error'].message);
    //     console.log(error, 'buy error');
    //   }
    // );
  }

  sale() {
    this.submitted = true;
              this.toastr.success('Successfully card sold');

    // if (this.editForm.valid) {
    //   var data = {
    //     quantity: '1',
    //     price: this.editForm.controls.price.value.toString(),
    //   };
    //   this.cardDetailService.sale(this.cardId, data).subscribe(
    //     (success) => {
    //       this.tradeHistory();
    //       this.submitted = false;
    //       this.closeModal();
    //       console.log(success, 'sale response');
    //       this.toastr.success('Successfully card sold');
    //       // this.router.navigate(['/cards']);
    //     },
    //     (error) => {
    //       this.submitted = false;
    //       this.toastr.error(error['error'].message);
    //       console.log(error, 'sale error');
    //     }
    //   );
    // }
  }

  tradeHistory() {
    this.cardDetailService.getTradeHistory(this.userId, this.page).subscribe(
      (success) => {
        this.tradeList = success['results'];
        this.totalPages = success['totalPages'];
        if (this.totalPages <= 1) {
          this.pageView = false;
        } else {
          this.pageView = true;
        }
        console.log(success, 'trade');
      },
      (error) => {
        console.log(error, 'error trade');
      }
    );
  }

  pageChanged(event) {
    this.page = event;
    this.tradeHistory();
  }

  Allcards() {
    //   this.cardDetailService.getCards().subscribe(success => {
    //     this.allCardsData = success['results'];
    //     // console.log(this.allCardsData,"cardsPageData");
    //   },
    //     (error) => {
    //       console.log(error, "Errors");
    //     });
  }

}
