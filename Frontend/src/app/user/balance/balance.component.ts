import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {UserCardsService} from '../user-cards.service';

import {ToastrService} from 'ngx-toastr';

interface BalanceResponse {
	balance: number;
}

@Component({
	selector: 'balance',
	templateUrl: './balance.component.html',
	styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent {
	
	balance: number;
	destination: string;

	constructor(private router: Router, private toastr: ToastrService, private route:ActivatedRoute, private userCardsService: UserCardsService){
		this.balance=0;
	}

	ngOnInit(): void {
		
		this.route.params.subscribe(res=>{
			
			this.userCardsService.getUserWalletBalance().subscribe((balance:BalanceResponse)=>{
				this.balance = balance.balance;
			});

		});

	}

	onWithdraw(): void {

		if (this.destination.startsWith('bitcoincash:')==false) {
			alert('destination should starts with bitcoincash:');
			return;
		}

		this.userCardsService.withdrawBCH(this.destination).subscribe(res=>{
			this.router.navigate(['/account']);
			this.toastr.success("Withdraw request sent");
		})
	}
}
