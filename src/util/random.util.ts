import { randomBytes } from 'crypto';

export class RandomUtil {
  /** 랜덤 값 생성 */
  public GenerateRandomValue(length: number): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytesArray = randomBytes(length);
    let value = '';

    for (let i = 0; i < length; i++) {
      value += charset.charAt(randomBytesArray[i] % charset.length);
    }

    return value;
  }
}
