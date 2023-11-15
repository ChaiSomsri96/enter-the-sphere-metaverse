import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../shared/services/auth.service";
import { User } from "../shared/user.model";
import { TutorialService } from "../tutorial/tutorial.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  menuLootbox: boolean = false;
  menuMarket: boolean = false;
  menuCard: boolean = false;
  isLogin;
  user: User;
  missionsData: any;
  progress: any;
  constructor(private tutorialService: TutorialService, private router: Router, private auth: AuthenticationService) {
    console.log('headeruser', this.auth.userValue)
    if (this.auth.userValue) {
      this.user = this.auth.userValue;
      this.isLogin = true;

    } else {
      this.isLogin = false;

    }
    this.auth.user.subscribe(res => {
      if (res) {
        this.user = this.auth.userValue;
        this.isLogin = true;

      } else {
        this.isLogin = false;

      }
    })
  }

  ngOnInit() {

    if (this.router.url === "/market") {
      this.menuMarket = true;
      this.menuCard = false;
    } else if (this.router.url === "/cards" || this.router.url === "/") {
      this.menuCard = true;
      this.menuMarket = false;
    }

    this.tutorialService.getMissions().subscribe(
      (response) => {
        this.missionsData = response;
      },
      (error) => {
        console.error(error);
      }
    );

    this.tutorialService.getProgress().subscribe(
      (response) => {
        this.progress = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getNonCompletedMissions() {
    var nonCompleted = 0;
    if (!this.missionsData || !this.progress)
      return nonCompleted;


    for (var mission of this.missionsData) {
      var missionProgress = this.progress.find(m => m.id == mission.id);

      if (mission.meta.action == 'register' && this.auth.userValue && this.auth.userValue.telegramId)
        continue;

      if (!missionProgress || !(missionProgress.claimed_at || (missionProgress.unlocked_at && !mission.reward)))
        nonCompleted++;
    }
    return nonCompleted;
  }

  onclick(name) {
    if (name == "market") {
      this.menuMarket = true;
      this.menuCard = false;
    } else if (name == "cards") {
      this.menuMarket = false;
      this.menuCard = true;
    }
  }

  logout() {
    this.auth.logout();
  }
}
