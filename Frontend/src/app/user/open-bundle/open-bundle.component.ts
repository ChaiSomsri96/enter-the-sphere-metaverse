import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BundlesService } from '../bundles.service';

import {LoaderService} from '../../shared/loader/loader.service';

@Component({
  selector: 'app-open-bundle',
  templateUrl: './open-bundle.component.html',
  styleUrls: ['./open-bundle.component.scss']
})
export class OpenBundleComponent implements OnInit {
  id: any;
  currentBundle: any [];
  selectedIndex: number = null;
	remainedItems: Array<any>;
  public isClicked = []
    constructor(private route: ActivatedRoute, private bundles: BundlesService, private loaderService: LoaderService, private router: Router) { 
			this.remainedItems = [];
		}

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.id = res['id']

			this.loaderService.setMessage("Minting cards. Please wait");
      this.bundles.openBundles(this.id).subscribe((res: any) => {
        this.currentBundle = res;
      })

			this.bundles.getAllCards().subscribe((res: Array<any>)=>{
				this.remainedItems = res.filter(el=>el.uuid!=this.id)

			})
    })
  }


  setIndex(index: number) {
    this.selectedIndex = index;
 	}

	onOpenAnotherPack(){
		if (this.remainedItems.length>0){
			this.router.navigate(['account/bundles',this.remainedItems[0].uuid,'open']);
		}
	}
}
