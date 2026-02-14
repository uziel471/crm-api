import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { ProductsService } from '@modules/products/products.service';
import { CreateProductDto } from '@modules/products/dto/create-product.dto';
import { UpdateProductDto } from '@modules/products/dto/update-product.dto';
import { UpdateProductUsersDto } from '@modules/products/dto/update-product-users.dto';

@ApiTags('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, dto);
  }

  @Put(':id/users')
  updateUsers(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateProductUsersDto,
  ) {
    return this.service.updateUsers(id, dto);
  }

  @Patch(':id/toggle')
  toggleStatus(@Param('id', ParseObjectIdPipe) id: string) {
    return this.service.toggleStatus(id);
  }

  @Get('/stats/dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }
}
