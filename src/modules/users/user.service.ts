import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from 'mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async createInfo(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      password,
      name,
      nickname,
      phone_number,
      role,
      login_type,
      provider,
    } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email, provider }, { nickname }, { phone_number }],
    });
    if (existingUser) {
      throw new ConflictException('이메일, 닉네임, 전화번호 중복');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = randomBytes(32).toString('hex');
    await this.mailService.sendVerificationEmail(email, verificationToken);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      nickname,
      phone_number,
      role,
      login_type,
      provider,
      is_email_verified: false,
      is_active: true,
    });

    return this.userRepository.save(user);
  }

  async readByAll(filters?: Partial<User>, limit = 10): Promise<User[]> {
    const where: Partial<User> = {};

    if (filters?.name) {
      where.name = filters.name;
    }

    if (filters?.email) {
      where.email = filters.email;
    }

    if (filters?.is_active) {
      where.is_active = filters.is_active;
    }

    return this.userRepository.find({
      where,
      take: limit,
    });
  }

  async readById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async readByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
        provider: 'local',
      },
    });
  }

  async updateInfo(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = { ...user, ...updateUserDto };
    return this.userRepository.save(updatedUser);
  }

  async deleteInfo(id: number): Promise<void> {
    const deleteResult = await this.userRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }
}
