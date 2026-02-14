import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '@modules/products/schemas/product.schema';

import { CreateProductDto } from '@modules/products/dto/create-product.dto';
import { UpdateProductDto } from '@modules/products/dto/update-product.dto';
import { UpdateProductUsersDto } from '@modules/products/dto/update-product-users.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly model: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    return this.model.create(dto);
  }

  async findAll() {
    return this.model
      .find()
      .populate('assignedUsers', 'name email role')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.model.findById(id).populate('assignedUsers', 'name email role');
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.model.findByIdAndUpdate(id, dto, { new: true });
  }

  async updateUsers(id: string, dto: UpdateProductUsersDto) {
    return this.model.findByIdAndUpdate(
      id,
      { assignedUsers: dto.users.map((id) => new Types.ObjectId(id)) },
      { new: true },
    );
  }

  async toggleStatus(id: string) {
    const product = await this.model.findById(id);
    if (!product) return null;

    product.isActive = !product.isActive;
    return product.save();
  }

  async leadWon(id: string, amount: number) {
    return this.model.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $inc: {
          'stats.totalSales': 1,
          'stats.totalRevenue': amount,
        },
      },
    );
  }

  async leadRevertWon(id: string, amount: number) {
    return this.model.updateOne(
      { _id: new Types.ObjectId(id) },
      { $inc: { 'stats.totalSales': -1, 'stats.totalRevenue': -amount } },
    );
  }

  async getDashboard() {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          activeProducts: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0],
            },
          },
          totalSales: { $sum: '$stats.totalSales' },
          totalRevenue: { $sum: '$stats.totalRevenue' },
          sellers: { $addToSet: '$assignedUsers' },
        },
      },
      {
        $project: {
          _id: 0,
          activeProducts: 1,
          totalSales: 1,
          totalRevenue: 1,
          totalSellers: {
            $size: {
              $reduce: {
                input: '$sellers',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      },
    ]);

    return (
      result[0] ?? {
        activeProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalSellers: 0,
      }
    );
  }
}
