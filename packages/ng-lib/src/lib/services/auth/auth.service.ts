import { Injectable } from "@angular/core";
import { AuthUser, getCurrentUser, AuthTokens, fetchAuthSession, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { BehaviorSubject } from "rxjs";




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signedIn':
          this.loggedIn$.next(true);
          break;
        case 'signedOut':
          this.loggedIn$.next(false);
          break;
      }
    });
  }
  public loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public async getCurrentUser(): Promise<AuthUser | undefined> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        this.loggedIn$.next(false);
      }

      this.loggedIn$.next(true);
      return user;

    } catch (err) {
      // Log this error
      this.loggedIn$.next(false);
      return undefined;
    }
  }

  public async getCurrentSession(): Promise<AuthTokens | undefined> {
    return (await fetchAuthSession()).tokens;
  }

  public async getCurrentUserFullName(): Promise<string | undefined> {
    let cognitoToken = await this.getCurrentSession();
    return cognitoToken?.idToken?.payload['name']?.toString();
  }

  public signOut() {
    signOut();
  }
}
