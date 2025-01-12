import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'modules/users/entities/user.entity';
import { Repository } from 'typeorm';

export class UserUtil {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async isNicknameTaken(nickname: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    return !!user;
  }
}
