import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { MainStack } from '../mainstack/entities/mainstack.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MainStack)
    private readonly mainstackRepository: Repository<MainStack>,
  ) {}

  async findAll() {
    return await this.userRepository.find({});
  }

  async findUserOrderbylike() {
    return await getRepository(User)
      .createQueryBuilder('user')
      .orderBy('user.like')
      .getMany();
  }

  async findusersearch({ search }) {
    return await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.mainstack', 'mainstack')
      .where('user.name = :name', { name: search })
      .orWhere('user.nickname = :nickname', { nickname: search })
      .getMany();
  }

  async fetchmainstack({ currentUser }) {
    const mainstack = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['mainstack'],
    });
    delete mainstack.mainstack.id;

    const bestmainstack = Object.values(mainstack.mainstack);
    //console.log(mainstack.mainstack);
    const max = Math.max(...bestmainstack);
    if (max === 0) return 'no';
    for (const key in mainstack.mainstack) {
      if (mainstack.mainstack[key] === max) {
        console.log(key);
        return key;
      }
    }
  }

  async create({ email, hashedPassword, phonenumber, name, nickname }) {
    const result1 = await this.userRepository.findOne({
      email: email,
    });

    if (result1) throw new ConflictException('이미 등록된 이메일입니다');

    const mainstack = await this.mainstackRepository.save({});

    return await this.userRepository.save({
      password: hashedPassword,
      email,
      nickname,
      name,
      phonenumber,
      mainstack,
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
