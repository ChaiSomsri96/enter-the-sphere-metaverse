import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../shared/services/auth.service';
import { AlertService } from '../shared/services/alert.service';

enum EmailStatus {
    Verifying,
    Failed
}
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private auth: AuthenticationService ,
      private alertService: AlertService
  ) { }

  ngOnInit() {
      const token = this.route.snapshot.queryParams['token'];

      // remove token from url to prevent http referer leakage
      this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

      this.auth.verifyEmail(token)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                  this.router.navigate(['../login'], { relativeTo: this.route });
              },
              error: () => {
                  this.emailStatus = EmailStatus.Failed;
              }
          });
  }
}
