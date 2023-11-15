import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rewardclaimed',
  templateUrl: './rewardclaimed.component.html',
  styleUrls: ['./rewardclaimed.component.scss']
})
export class RewardclaimedComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { reward: string }, public dialogRef: MatDialogRef<RewardclaimedComponent>) { }

  ngOnInit(): void {
  }

  gotoAccount() {
    this.dialogRef.close({
      navigate: "account"
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
