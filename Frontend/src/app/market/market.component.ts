import { Component, OnInit } from '@angular/core';
import { MarketService } from './market.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  allCardsData;
  id;
  rarityDetails: any = [
    {
      card_rarity: 'common',
      image: '/assets/images/rarity1.png',
    },
    {
      card_rarity: 'uncommon',
      image: '/assets/images/rarity2.png',
    },
    {
      card_rarity: 'rare',
      image: '/assets/images/rarity3.png',
    },
    {
      card_rarity: 'super rare',
      image: '/assets/images/rarity5.png',
    },
    {
      card_rarity: 'legendary',
      image: '/assets/images/rarity4.png',
    },
    {
      card_rarity: 'super legendary',
      image: '/assets/images/rarity5.png',
    },
  ];
  typeDetails: any = [
    {
      card_type:"Equipment",
      image: "/assets/images/type4.png"
    },
    {
      card_type:"Action",
      image: "/assets/images/type3.png"
    },
    {
      card_type:"Holographic",
      image: "/assets/images/type2.png"
    },
    {
      card_type:"Summon",
      image: "/assets/images/type1.png"
    },

  ];
  isRaritySelected = false;
  isTypeSelected = false;

  constructor(private marketService: MarketService, private router: Router) {}

  ngOnInit(): void {
    // $('[data-toggle="tooltip"]').tooltip()((
    this.Allcards();
    // this.getRarity();
    // this.getTypes();
  }

  // accountInfo() {
  //   this.marketService.accountInfo().subscribe((success) => {
  //   }, (error) => {
  //     this.router.navigate(['/login']);
  //   })
  // }

  Allcards() {
    this.marketService.getCards().subscribe(
      (success) => {
        this.allCardsData = success;
        // console.log(this.allCardsData,"cardsPageData");
      },
      (error) => {
        console.log(error, 'Errors');
      }
    );
  }

  // getTypes() {
  //   this.marketService.getTypes().subscribe(
  //     (success) => {
  //       this.typeDetails = success;
  //       console.log(this.typeDetails, 'cardsPageData types');
  //     },
  //     (error) => {
  //       console.log(error, 'Error in getting types');
  //     }
  //   );
  // }

  // getRarity() {
  //   this.marketService.getRarity().subscribe(
  //     (success) => {
  //       this.rarityDetails = success;
  //       console.log(this.rarityDetails, 'getRarity types');
  //     },
  //     (error) => {
  //       console.log(error, 'Error in getting types');
  //     }
  //   );
  // }

  selectRarity(id) {
    this.isRaritySelected = true;
    this.marketService.getCardsByRarity(id).subscribe(
      (success) => {
        this.allCardsData = success['results'];
        if (!this.allCardsData.length) {
          return;
        }
        this.allCardsData = this.allCardsData.filter((i) => i.status == true);
        console.log(this.allCardsData, 'fileterr');
        this.allCardsData.forEach((element) => {
          // console.log(element,"elementgdde===");
          if (element.description.length > 25) {
            element.descriptionShort = element.description.slice(0, 25) + '..';
          } else {
            element.descriptionShort = element.description;
          }

          // console.log(element.description.slice(0,50),"splice")
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  clearRarity() {
    this.isRaritySelected = false;
    this.Allcards();
  }

  selectType(id) {
    this.isTypeSelected = true;
    this.marketService.getCardsType(id).subscribe(
      (success) => {
        // document.getElementById('spinner').style.display = 'block';
        this.allCardsData = success['results'];
        this.allCardsData = this.allCardsData.filter((i) => i.status == true);
        console.log(this.allCardsData, 'fileterr  in types');
        this.allCardsData.forEach((element) => {
          // console.log(element,"elementgdde===");
          if (element.description.length > 25) {
            element.descriptionShort = element.description.slice(0, 25) + '..';
          } else {
            element.descriptionShort = element.description;
          }

          // console.log(element.description.slice(0,50),"splice")
        });
        console.log(this.allCardsData, 'getTypecards');
      },
      (error) => {
        console.log(error, 'Error');
      }
    );
  }

  clearType() {
    this.isTypeSelected = false;
    this.Allcards();
  }

}
