import { Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { Product } from './entities/product.entity';
import { PostgresError } from 'src/interfaces/error.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto)

      await this.productRepository.save(product)

      return product
      
    } catch (error) {
      this.handleDBException(error)
    }
  }

  findAll() {
    try {
      const products = this.productRepository.find()

      return products

    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findOne(id: string) {
 
    const product = await this.productRepository.findOneBy({ id })

    if(!product) throw new NotFoundException('Not found product');

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    
    await this.productRepository.remove(product)
  }

  private handleDBException(error: unknown) {

    const errorCode = (error as PostgresError).code
    const errorDetail = (error as PostgresError).detail

    if (errorCode === '23505') throw new BadRequestException(errorDetail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error')
  }

}

