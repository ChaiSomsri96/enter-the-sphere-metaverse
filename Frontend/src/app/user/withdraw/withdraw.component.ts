import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {UserCardsService} from '../user-cards.service';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'withdraw',
	templateUrl: './withdraw.component.html',
	styleUrls: ['./withdraw.component.scss'],
})

export class WithdrawComponent implements OnInit {


	destination: string;
	card: any;

	constructor(private router: Router, private route: ActivatedRoute, private userCardsService: UserCardsService, private toastr: ToastrService) {
		this.destination='';
	}

	ngOnInit() : void{
		this.route.params.subscribe(res=>{
			// TODO: could be better to implement get single card by id
			this.userCardsService.getUserCards().subscribe(items=>{
				const cards = (items as any[]).filter(card=>card.uuid==res['id']);

				if (cards.length>0){
					this.card = cards[0];
				}

			});


		});
	}

	onWithdraw() : void {

		if (!this.destination.startsWith("simpleledger") || this.destination.length!=55){
			alert('Please specify SLP address in a format like \'simpleledger:XXXXXXXX\'');
			return;
		}

		this.userCardsService.withdrawCard(this.card.tokenId, this.destination).subscribe(res=>{
			this.router.navigate(['/account']);

			this.toastr.success("Withdrawal successful");
		})
	}

}

