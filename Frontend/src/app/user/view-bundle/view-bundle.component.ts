import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BundlesService } from '../bundles.service';

@Component({
  selector: 'app-view-bundle',
  templateUrl: './view-bundle.component.html',
  styleUrls: ['./view-bundle.component.scss']
})
export class ViewBundleComponent implements OnInit {
  id: any;
  currentBundle: any [];
  selectedIndex: number = null;
  public isClicked = []
    constructor(private route: ActivatedRoute, private bundles: BundlesService) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.id = res['id']
      this.bundles.getbundledCards(this.id).subscribe((res: any) => {
        this.currentBundle = res;
      })
    })


  }
  setIndex(index: number) {
    this.selectedIndex = index;
 }

}
