import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from './shared/services/auth.service';
import { User } from './shared/user.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'the-sphere';
  token;
  user: User;
  rewardsSocket: WebSocket;

  constructor(public location: Location, private router: Router, private toastr: ToastrService, private auth: AuthenticationService, private dialog: MatDialog) {
    this.auth.user.subscribe(x => {
      this.user = x;
      if (this.rewardsSocket)
        return;

      this.rewardsSocket = new WebSocket("wss://staging.enter-the-sphere.com/api/messaging/connect?u=" + x.uuid);
      this.rewardsSocket.onopen = (event) => {
        console.log(JSON.stringify(event));
        this.rewardsSocket.onmessage = (data) => {
          if (data.data && data.data.indexOf('bundleId') >= 0 && !this.toastr.currentlyActive)
            this.toastr
              .success("New NFT Card Pack!")
              .onTap.subscribe(() => {
                this.router.navigate(["account"])
                this.dialog.closeAll();
              });
        }
      };
    });

  }
  ngOnInit() {

  }
}
