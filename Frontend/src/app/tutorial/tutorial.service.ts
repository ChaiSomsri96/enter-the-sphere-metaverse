import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  /*
  Base path is /api/missionsv1/

  GET /missions - returns list of available missions ( for now it is json on host
  GET /progress?u={user_id} - returns list of completed missions and progress for non completed missions for specific users
  POST /progress - reports the event which is used to unlock mission. Returns the affected missions by posted Event and Reward if any.

  */

  getApiRoot() {
    var root = environment.apiUrl;
    return root.substring(0, root.length - 3); //need to remove /v1
  }

  getMissions() {
    return this.http.get(this.getApiRoot() + "/missionsv1/missions");
  }

  getProgress() {
    return this.http.get(`${this.getApiRoot() + "/missionsv1/progress"}?u=${this.auth.userValue ? this.auth.userValue.uuid : null}`)
  }

  reportProgress(counter) {
    return this.http.post(this.getApiRoot() + "/missionsv1/progress", {
      counter: counter,
      user_id: this.auth.userValue ? this.auth.userValue.uuid : null
    })
  }

  claimReward(missionId) {
    var url = this.getApiRoot() + "/missionsv1/claim";
    var data = {
      mission_id: missionId,
      user_id: this.auth.userValue ? this.auth.userValue.uuid : null
    }
    return this.http.post(url, data);
  }
}
