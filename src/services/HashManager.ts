import * as bcrypt from 'bcryptjs';

export default class HashManager {
  public async hash(s: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_COST as string);
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(s, salt);
  }

  public async compare(s: string, hash: string): Promise<boolean> {
    return bcrypt.compare(s, hash);
  }
}
