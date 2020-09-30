import {
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Put,
  Logger,
  Param,
  Delete,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { Tag } from '../entities/tag.entity'
import { CreateUserBody, DeleteUserBody, EditUserBody } from '../dto/user.dto'

export type UsersResponse = {
  users: User[]
}

export type UserResponse = {
  user: User
}

@Controller('users')
export class UserController {
  @InjectRepository(Tag)
  private tagsRepository: Repository<Tag>

  @InjectRepository(User)
  private usersRepository: Repository<User>

  constructor(private logger: Logger) {}

  @Get()
  async getUsers(): Promise<UsersResponse> {
    const users = await this.usersRepository.find()

    return {
      users,
    }
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({ id: Number(userId) })

    if (!user) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND)
    }

    return {
      user,
    }
  }

  @Post()
  async createUser(@Body() body: CreateUserBody): Promise<UserResponse> {
    const { tagIds } = body

    const tags = await this.tagsRepository.findByIds(tagIds)

    const user = await this.usersRepository.save({
      ...body,
      tags,
    })

    return {
      user,
    }
  }

  @Put()
  async editUser(@Body() body: EditUserBody): Promise<UserResponse> {
    const { id, tagIds } = body

    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tags'],
    })

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const tags = await this.tagsRepository.findByIds(tagIds ?? [])

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...body,
      tags: tagIds ? tags : user.tags,
      tagIds: tagIds ? tagIds : user.tagIds,
    })

    return {
      user: updatedUser,
    }
  }

  @Delete()
  async deleteUser(@Body() body: DeleteUserBody): Promise<{ success: true }> {
    const { id } = body

    await this.usersRepository.delete(id)

    return {
      success: true,
    }
  }
}
