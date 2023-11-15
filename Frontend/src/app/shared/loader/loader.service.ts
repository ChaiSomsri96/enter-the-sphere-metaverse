import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    isLoading = new Subject<boolean>();
		message = new Subject<string>();

		public setMessage(message){
			this.message.next(message); 
		}

    show() {
        this.isLoading.next(true);
    }
    hide() {
        this.isLoading.next(false);
				this.message.next("");
    }
}
