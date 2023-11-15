import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {UserCardsService} from '../user-cards.service';

import {ToastrService} from 'ngx-toastr';

@Component({
	selector: 'sellcard',
	templateUrl: './sell-card.component.html',
	styleUrls: ['./sell-card.component.scss'],
})

export class SellCardComponent {
	
	sellprice: number;
	card: any;

	constructor(private router: Router, private toastr: ToastrService, private route:ActivatedRoute, private userCardsService: UserCardsService){
		this.sellprice=0.01;
	}

	ngOnInit(): void {
		
		this.route.params.subscribe(res=>{
			
			this.userCardsService.getUserCards().subscribe(items=>{
				
				const cards = (items as any[]).filter(card=>card.uuid==res['id']);

				if (cards.length>0){
					
					this.card = cards[0];
				
				}

			});

		});

	}

	onSell(): void {

		if (this.sellprice<=0) {
			alert('Sell price is not correct');
			return;
		}

		this.userCardsService.sellCard(this.card.tokenId, this.sellprice*1e8).subscribe(res=>{
			this.router.navigate(['/account']);

			this.toastr.success("Sell request sent");
		})
	}
}
