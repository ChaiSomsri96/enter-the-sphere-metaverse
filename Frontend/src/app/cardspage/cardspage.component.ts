import { Component, OnInit } from '@angular/core';
import { CardspageService } from './cardspage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cardspage',
  templateUrl: './cardspage.component.html',
  styleUrls: ['./cardspage.component.scss']
})
export class CardspageComponent implements OnInit {

  allCardsData;
  id;
  rarityDetails: any = [
    {
      card_rarity: 'Common',
      image: '/assets/images/rarity1.png',
    },
    {
      card_rarity: 'Uncommon',
      image: '/assets/images/rarity2.png',
    },
    {
      card_rarity: 'Rare',
      image: '/assets/images/rarity3.png',
    },
    {
      card_rarity: 'Super Rare',
      image: '/assets/images/rarity4.png',
    },
    {
      card_rarity: 'Legendary',
      image: '/assets/images/rarity5.png',
    },
    {
      card_rarity: 'Ultimate Legendary',
      image: '/assets/images/rarity6.png',
    },
  ];
  typeDetails: any = [
    {
      card_type:"Equipment",
      image: "/assets/images/type1.png"
    },
    {
      card_type:"Action",
      image: "/assets/images/type4.png"
    },
    {
      card_type:"Summon",
      image: "/assets/images/type2.png"
    },
    {
      card_type:"Buff",
      image: "/assets/images/type3.png"
    },

  ];
  filterData;
  searchName;
  isRaritySelected = false
  isTypeSelected = false

  constructor(private cardsPageService: CardspageService, private router: Router) { }

  ngOnInit(): void {
    this.Allcards();
    // this.getTypes();
    // this.getRarity()
  }

  // accountInfo() {
  //   this.cardsPageService.accountInfo().subscribe((success) => {
  //     this.Allcards();
  //   this.getTypes();
  //   this.getRarity()
  //   }, (error) => {
  //     this.router.navigate(['/login']);
  //   })
  // }

  Allcards() {
    this.cardsPageService.getCards().subscribe((success: any)  => {
      // console.log(success,"cardsPageData");
      this.allCardsData = success;
      // this.allCardsData = this.allCardsData.filter(i => i.status == true);
      console.log( "fileterr", this.allCardsData)
      // this.allCardsData.forEach(element => {
      //   // console.log(element,"elementgdde===");
      //   // if (element.desc.length > 25) {
      //   //   element.shortDesc = element.description.slice(0, 25) + "..";
      //   // }
      //   // else {
      //   //   element.descriptionShort = element.description;
      //   // }

      //   // console.log(element.description.slice(0,50),"splice")
      // });

      // this.router.navigate(['/card-detail',this.id]);
    },
      (error) => {
        console.log("Errors", error );
      });
  }

  getTypes() {
    this.cardsPageService.getTypes().subscribe(success => {
      this.typeDetails = success;
      console.log(this.typeDetails, "cardsPageData types");
    },
      (error) => {
        console.log(error, "Error in getting types");
      })
  }

  getRarity() {
    this.cardsPageService.getRarity().subscribe(success => {
      this.rarityDetails = success;
      console.log(this.rarityDetails, "getRarity types");
    },
      (error) => {
        console.log(error, "Error in getting types");
      })
  }

  selectType(id) {

    this.isTypeSelected = true
    this.cardsPageService.getCardsType(id).subscribe(success => {
      // document.getElementById('spinner').style.display = 'block';
      this.allCardsData = success;
      this.allCardsData = this.allCardsData.filter(i => i.status == true);
      console.log(this.allCardsData, "fileterr  in types")
      // this.allCardsData.forEach(element => {
      //   // console.log(element,"elementgdde===");
      //   if (element.description.length > 25) {
      //     element.descriptionShort = element.description.slice(0, 25) + "..";
      //   }
      //   else {
      //     element.descriptionShort = element.description;
      //   }

      //   // console.log(element.description.slice(0,50),"splice")
      // });
      console.log(this.allCardsData, "getTypecards");
    },
      (error) => {
        console.log(error, "Error");
      })

    //   if(id=="all"){
    //     this.cardsPageService.getCards().subscribe(success=>{
    //       // document.getElementById('spinner').style.display = 'block';
    //       this.allCardsData = success['results'];
    //       this.allCardsData=this.allCardsData.filter(i=>i.status==true);
    //     console.log(this.allCardsData,"fileterr")
    //     this.allCardsData.forEach(element => {
    //       // console.log(element,"elementgdde===");
    //       if(element.description.length>25){
    //         element.descriptionShort=element.description.slice(0,25)+"..";
    //       }
    //       else{
    //         element.descriptionShort=element.description;
    //       }

    //       // console.log(element.description.slice(0,50),"splice")
    //     });
    //     },
    //     (error)=>{
    //       console.log(error,"Errors");
    //     });
    //   }else
    //   console.log(id,"selecttype");
    //   this.cardsPageService.getCardsType(id).subscribe(success=>{
    //     // document.getElementById('spinner').style.display = 'block';
    //     this.allCardsData = success['results'];
    //     this.allCardsData=this.allCardsData.filter(i=>i.status==true);
    //     console.log(this.allCardsData,"fileterr  in types")
    //     this.allCardsData.forEach(element => {
    //       // console.log(element,"elementgdde===");
    //       if(element.description.length>25){
    //         element.descriptionShort=element.description.slice(0,25)+"..";
    //       }
    //       else{
    //         element.descriptionShort=element.description;
    //       }

    //       // console.log(element.description.slice(0,50),"splice")
    //     });
    //     console.log(this.allCardsData,"getTypecards");
    //   },
    //   (error)=>{
    //     console.log(error,"Error");
    //   })
    // }
  }

  clearType() {
    this.allCardsData = [];
    this.isTypeSelected = false
    this.Allcards()
  }

  selectRarity(id) {
    this.isRaritySelected = true
    this.cardsPageService.getCardsByRarity(id).subscribe((success) => {
      this.allCardsData = success;
      if (!this.allCardsData.length) {
        return;
      }
      this.allCardsData = this.allCardsData.filter(i => i.status == true);
      console.log(this.allCardsData, "fileter")
      // this.allCardsData.forEach(element => {
      //   // console.log(element,"elementgdde===");
      //   if (element.description.length > 25) {
      //     element.descriptionShort = element.description.slice(0, 25) + "..";
      //   }
      //   else {
      //     element.descriptionShort = element.description;
      //   }

      //   // console.log(element.description.slice(0,50),"splice")
      // });

    }, (error) => {
      console.log(error);

    })

  }

  clearRarity() {
    this.isRaritySelected = false
    this.Allcards()
  }


  getTypeCards(value){
    debugger
    this.isTypeSelected = true
    debugger
    this.cardsPageService.getCards().subscribe((success: any)  => {
      // console.log(success,"cardsPageData");
      this.allCardsData = success;
      this.allCardsData = this.allCardsData.filter(card => card.type === value);
      // this.allCardsData = this.allCardsData.filter(i => i.status == true);
      // this.allCardsData.forEach(element => {
      //   // console.log(element,"elementgdde===");
      //   // if (element.desc.length > 25) {
      //   //   element.shortDesc = element.description.slice(0, 25) + "..";
      //   // }
      //   // else {
      //   //   element.descriptionShort = element.description;
      //   // }

      //   // console.log(element.description.slice(0,50),"splice")
      // });

      // this.router.navigate(['/card-detail',this.id]);
    },
      (error) => {
        console.log("Errors", error );
      });
  }

  getRarityCards(value){
    this.isRaritySelected = true
    debugger
    this.cardsPageService.getCards().subscribe((success: any)  => {
      // console.log(success,"cardsPageData");
      this.allCardsData = success;
      this.allCardsData = this.allCardsData.filter(card => card.rarity === value);
      // this.allCardsData = this.allCardsData.filter(i => i.status == true);
      // this.allCardsData.forEach(element => {
      //   // console.log(element,"elementgdde===");
      //   // if (element.desc.length > 25) {
      //   //   element.shortDesc = element.description.slice(0, 25) + "..";
      //   // }
      //   // else {
      //   //   element.descriptionShort = element.description;
      //   // }

      //   // console.log(element.description.slice(0,50),"splice")
      // });

      // this.router.navigate(['/card-detail',this.id]);
    },
      (error) => {
        console.log("Errors", error );
      });
  }

  search(event) {
    this.searchName = event.target.value;
    console.log(this.searchName, "searchName")
    // this.page=1;
    // console.log(this.model,"search");
    if (this.searchName != "") {
      this.cardsPageService.search(this.searchName).subscribe(success => {
        this.allCardsData = success;

				// wtf is status???? 
        // this.allCardsData = this.allCardsData.filter(i => i.status == true);
        console.log(this.allCardsData, "search response")
        // this.allCardsData.forEach(element => {
        //   // console.log(element,"elementgdde===");
        //   if (element.desc.length > 25) {
        //     element.shortDesc = element.desc.slice(0, 25) + "..";
        //   }
        //   else {
        //     element.shortDesc = element.desc;
        //   }
        // });

        console.log(success, "search response");
      },
        (error) => {
          console.log(error, "search error");
        });
    }
    else {
      setTimeout(() => {
        this.Allcards();
      }, 1000);
      // this.Allcards();
    }
  }
}
