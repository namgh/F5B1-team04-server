import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find({});
  }

  async create({ email, hashedPassword, phonenumber, name, nickname }) {
    const result1 = await this.userRepository.findOne({
      email: email,
    });

    if (result1) throw new ConflictException('이미 등록된 이메일입니다');

    return await this.userRepository.save({
      password: hashedPassword,
      email,
      nickname,
      name,
      phonenumber,
    });
  }
  async socailcreate({ password, email, name }) {
    const result1 = await this.userRepository.findOne({
      email: email,
    });

    if (result1) throw new ConflictException('이미 등록된 이메일입니다');
    return await this.userRepository.save({
      password,
      email,
      name,
      nickname: name,
    });
  }

  async findemail({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async updateUser({
    hashedPassword,
    phonenumber,
    name,
    nickname,
    currentUser,
  }) {
    const { email, ...rest } = currentUser;
    const User = await this.userRepository.findOne({ email });
    const password = hashedPassword;
    const newUser = { ...User, password, phonenumber, name, nickname };
    return await this.userRepository.save(newUser);
  }

  async delete({ currentUser }) {
    const { email, ...rest } = currentUser;
    const result = await this.userRepository.softDelete({ email }); // 모든조건 삭제 가능
    return result.affected ? true : false;
  }
}
