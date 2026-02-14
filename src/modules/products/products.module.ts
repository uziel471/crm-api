import { Module } from '@nestjs/common';
import { ProductsService } from '@modules/products/products.service';
import { ProductsController } from '@modules/products/products.controller';

import {
  Product,
  ProductSchema,
} from '@modules/products/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
