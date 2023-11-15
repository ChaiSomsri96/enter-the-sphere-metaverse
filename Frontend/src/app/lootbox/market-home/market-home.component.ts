import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LootboxService } from "../lootbox.service";

@Component({
  selector: "app-market-home",
  templateUrl: "./market-home.component.html",
  styleUrls: ["./market-home.component.scss"],
})
export class MarketHomeComponent implements OnInit {
  quantity: number;

  constructor(
    private router: Router,
    private lootbox: LootboxService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  startPurchase() {
    ;
    if (!this.quantity) {
      this.toastr.error("Please enter quantity to continue");
      return;
    }
    this.lootbox.purchaseValue.next(this.quantity);
    this.router.navigate(["/lootbox/checkout"]);
  }


}
