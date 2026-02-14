import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '@modules/users/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .select('name email role password')
      .lean();

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    Reflect.deleteProperty(user, 'password');

    return user;
  }

  async validateRefreshToken(userId: string, token: string) {
    const user = await this.userModel.findById(userId).select('+refreshToken');

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(token, user.refreshToken);
    if (!valid) throw new UnauthorizedException();
  }

  async updateRefreshToken(userId: string, token: string) {
    await this.userModel.updateOne({ _id: userId }, { refreshToken: token });
  }

  async removeRefreshToken(userId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } },
    );
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
