import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ExtractJwt } from 'passport-jwt';
import { BaseController } from '~core/http/controllers/base.controller';
import { AuthService } from '~users/services/auth.service';
import { ApiSetValue } from '~swaggers/decorators/api-set-value.decorator';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenAuthGuard } from '../guards/refresh-token-auth.guard';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController extends BaseController {
    constructor(private authService: AuthService) {
        super();
    }

    @Post('login')
    @ApiSetValue('token', 'token')
    @HttpCode(HttpStatus.OK)
    async login(@Body() request: LoginDto) {
        return await this.authService.login(request.email, request.password);
    }

    @Post('register')
    @ApiSetValue('token', 'token')
    @HttpCode(HttpStatus.OK)
    async register(@Body() body: RegisterDto) {
        return await this.authService.register(body);
    }

    @Delete('logout')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtAuthGuard)
    async logout(@Request() request) {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        return await this.authService.logout(token);
    }

    @Post('refresh-token')
    @UseGuards(RefreshTokenAuthGuard)
    refreshToken(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
}
