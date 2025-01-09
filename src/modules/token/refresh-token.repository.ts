import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async saveToken(
    user_id: number,
    token: string,
    expiration_at: Date,
  ): Promise<RefreshToken> {
    await this.repository.delete({ user_id });

    const refreshToken = this.repository.create({
      user_id,
      token,
      expiration_at,
    });

    return this.repository.save(refreshToken);
  }

  async readTokenByUserId(user_id: number): Promise<RefreshToken> {
    return this.repository.findOne({ where: { user_id } });
  }

  async deleteToken(user_id: number): Promise<void> {
    await this.repository.delete({ user_id });
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where('expiration_at < :now', { now })
      .execute();
  }
}
