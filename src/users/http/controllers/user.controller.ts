import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { BaseController } from '~core/http/controllers/base.controller';
import { UserService } from '~users/services/user.service';
import { UserEntity } from '~users/entities/user.entity';
import { CurrentUser } from '~users/decorators/current-user.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController extends BaseController {
    constructor(private userService: UserService) {
        super();
    }

    @Get('me')
    async user(@CurrentUser() user: UserEntity) {
        return this.userService.getInfo(user.id);
    }

    @Put('change-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async changePassword(@CurrentUser() user: UserEntity, @Body() request: ChangePasswordDto) {
        return this.userService.changePassword(user.id, request.newPassword, request.oldPassword);
    }
}
