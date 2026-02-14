import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProductStats } from '@modules/products/schemas/product-stats.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  url?: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  assignedUsers: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: () => ProductStats, required: false })
  stats?: ProductStats;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
