import { Component, Inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {
  
  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = localStorage;

  constructor(private oktaAuthSerivce: OktaAuthStateService,
  @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {


  }

  ngOnInit(): void {
    this.oktaAuthSerivce.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      

      }
    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (user) => {
          this.userFullName = user.name!;
          
          const theEmail = user.email!;
          
          this.storage.setItem('userEmail ', JSON.stringify(theEmail));

        }
      );
    }
  
     
  }

  logout() { 
    this.oktaAuth.signOut();

  }

}
