import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserContextService {
  user: any;

  setUser(user: any) {
    // console.log('UserContextService.setUser', user);
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
