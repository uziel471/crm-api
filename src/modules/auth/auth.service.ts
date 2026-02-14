import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { LoginResponseDto } from '@modules/auth/dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.validate(dto.email, dto.password);
    const userId = String(user._id);
    const tokens = await this.generateTokens(userId, user.role);

    await this.updateRefreshToken(userId, tokens.refresh_token);
    const { access_token: accessToken, refresh_token: refreshToken } = tokens;
    return {
      accessToken,
      refreshToken,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refresh(userId: string, token: string) {
    await this.usersService.validateRefreshToken(userId, token);

    const user = await this.usersService.findById(userId);

    const tokens = await this.generateTokens(userId, user.role);

    await this.updateRefreshToken(userId, tokens.refresh_token);

    const { access_token: accessToken, refresh_token: refreshToken } = tokens;
    return {
      accessToken,
      refreshToken,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, { expiresIn: '15m' }),
      this.jwt.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.usersService.updateRefreshToken(userId, hashed);
  }
}
