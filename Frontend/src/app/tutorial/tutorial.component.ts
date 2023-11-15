import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/auth.service';
import { TutorialService } from './tutorial.service';
import { MatDialog } from "@angular/material/dialog";
import { RewardclaimedComponent } from '../rewardclaimed/rewardclaimed.component';

enum MissionStatus {
  Unavailable,
  Locked,
  Unlocked,
  Claimed
}
@Component({
  selector: 'app-missions',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})

export class TutorialComponent implements OnInit {

  missionsData: any;
  progress: any;
  constructor(private tutorialService: TutorialService, private router: Router, private auth: AuthenticationService, private dialog: MatDialog) { }

  ngOnInit(): void {

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

  onSelect(mission): void {

    var loggedWithTG = this.auth.userValue && this.auth.userValue.telegramId;

    var missionProgress = (<any>this.progress).find(m => {
      return m.id === mission.id
    });


    if (missionProgress && (missionProgress.claimed_at || (missionProgress.unlocked_at && !mission.reward)))
      return; //done


    if (mission.meta.action == 'register') {
      if (!loggedWithTG)
        this.router.navigate(["login"]);
      return;
    }

    if (missionProgress && missionProgress.unlocked_at) {
      this.tutorialService.claimReward(mission.id).subscribe(
        (response) => {
          let dialogRef = this.dialog.open(RewardclaimedComponent, {
            height: '200px',
            width: '500px',
            data: { reward: this.getReadableReward(mission) }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result && result.navigate)
              this.router.navigate([result.navigate]);
          });
        },
        (error) => {
          console.error(error);
        }
      );
      return;
    }



    if (mission.meta.action == 'register') {
      this.router.navigate(["login"]);
      return;
    }

    var url = null;

    var tg_id = this.auth.userValue ? this.auth.userValue.telegramId : 'default';

    switch (mission.meta.action) {
      case ("win_duel"):
        if (mission.meta.actionPayload == "player") {
          window.location.href = "https://t.me/thespherechat";
          return;
        }
        else {
          url = `play.enter-the-sphere.com?id=${tg_id}`;
          if (mission.meta.actionPayload)
            url += "&bot=" + mission.meta.actionPayload;

          url += "&name=" + (this.auth.userValue ? this.auth.userValue.firstName : null);
        }
        break;
      case ("submit_deck"):
        url = `deck.enter-the-sphere.com?id=${tg_id}`;
        break;
      case ("register"):
        this.router.navigate(["register"]);
        return;
      case ("open_pack"):
        this.router.navigate(["account"]);
        return;
    }

    url += "&action=" + mission.meta.action;
    url += "&actionPayload=" + mission.meta.actionPayload; //same as bot. cleanup this
    url += "&uuid=" + (this.auth.userValue ? this.auth.userValue.uuid : null);
    if (url)
      window.location.href = `https://${url}&from_site=${window.location.href}`;
  }

  isDisabled(mission) {
    var status = this.getMissionStatus(mission);
    return status == MissionStatus.Claimed || status == MissionStatus.Unavailable;
  }

  getMissionStatus(mission) {
    var loggedWithTG = this.auth.userValue && this.auth.userValue.telegramId;

    if (mission.meta.action == "register")
      return loggedWithTG ? MissionStatus.Claimed : MissionStatus.Locked;

    if (!loggedWithTG)
      return MissionStatus.Unavailable;


    if (!this.progress)
      return MissionStatus.Locked;

    var missionProgress = this.progress.find(m => {
      return m.id === mission.id
    });

    if (!missionProgress)
      return MissionStatus.Locked;

    if (missionProgress && (missionProgress.claimed_at > 0 || (missionProgress.unlocked_at > 0 && !mission.reward)))
      return MissionStatus.Claimed;

    if (missionProgress.unlocked_at > 0)
      return MissionStatus.Unlocked;

    return MissionStatus.Locked;
  }

  getMissionProgress(mission) {
    return `${this.getMissionProgressNumeric(mission)}/${mission.goal}`;
  }

  getMissionProgressNumeric(mission) {
    var progress = 0;
    if (!this.progress)
      return progress;


    var mission = (<any>this.missionsData).find(m => {
      return m.id === mission.id
    });

    if (mission.meta.action == "register")
      return progress;

    if (!(this.auth.userValue && this.auth.userValue.telegramId))
      return progress;

    var missionProgress = this.progress.find(m => {
      return m.id === mission.id
    });

    if (!missionProgress)
      return progress;

    return missionProgress.current;
  }

  getActionColor(mission) {

    switch (this.getMissionStatus(mission)) {
      case (MissionStatus.Locked):
        return '#ca5d22';
      case (MissionStatus.Unlocked):
        return '#1a9b99';
      case (MissionStatus.Unavailable):
      case (MissionStatus.Claimed):
        return '#555555';
    }
  }

  getCompletedMissionCount() {
    var completed = 0;
    if (!this.missionsData)
      return completed;


    for (var mission of this.missionsData)
      if (this.getMissionStatus(mission) == MissionStatus.Claimed)
        completed++;

    return completed;
  }

  getAction(mission) {

    switch (this.getMissionStatus(mission)) {
      case (MissionStatus.Unavailable):
        return 'LOCKED';
      case (MissionStatus.Locked):
        return mission.meta.action == 'register' ? 'LOG IN WITH TELEGRAM' : 'GO!';
      case (MissionStatus.Unlocked):
        return 'CLAIM';
      case (MissionStatus.Claimed):
        return 'DONE';
    }
  }

  getReadableReward(mission) {

    var result = [];

    if (mission.reward)
      for (var item of mission.reward) {
        var label = "unknown";
        //add more id needed
        switch (item.kind) {
          case ("card_pack"):
            label = "NFT Card Pack"
            break;

          case ("orb"):
            label = "Orb"
            break;
        }

        if (item.amount > 1) {
          label = `${item.amount}x ${label}s`;
        }

        result.push(label);
      }

    return result.join(', ');
  }
}