import { Injectable } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { UserService } from 'modules/users/user.service';

@Injectable()
export class AuthService {
  constructor() {}

  async login(loginDto: loginDto) {
    const { email, password } = loginDto;

    return;
  }
}
