import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RefreshAuthGuard } from '@modules/auth/guards/refresh.guard';
import { Public } from '@common/decorators/public.decorator';
import { LoginResponseDto } from '@modules/auth/dto/login-response.dto';
import type { RequestWithUser } from '@common/types/request-with-user';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.auth.login(dto);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req: RequestWithUser): Promise<LoginResponseDto> {
    return this.auth.refresh(req.user.sub, req.body.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: RequestWithUser) {
    return this.auth.logout(req.user.sub);
  }
}
