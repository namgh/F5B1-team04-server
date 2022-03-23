import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User, USER_TYPE_ENUM } from '../user/entities/user.entity';
import { UpdateCoachInput } from './dto/updateCoach.input';
import { CoachProfile } from './entities/coachprofile.entity';

interface IUpdateCoach {
  userId: string;
  updateCoachInput: UpdateCoachInput;
}

@Injectable()
export class CoachProfileService {
  constructor(
    @InjectRepository(CoachProfile)
    private readonly coachprofileRepository: Repository<CoachProfile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      relations: ['coachProfile'],
    });
  }

  async findOne({ userId }) {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['coachProfile'],
    });
  }

  async create({ userId, createProfileInput }) {
    const user_ = await this.userRepository.findOne(userId);
    const coachUser = {
      ...user_,
      coachprofile: await this.coachprofileRepository.save({
        ...createProfileInput,
      }),
      status: USER_TYPE_ENUM.COACH,
    };

    return await this.userRepository.save(coachUser);
  }

  async update({ userId, updateCoachInput }: IUpdateCoach) {
    const user_ = await this.userRepository.findOne({ id: userId });
    const updateCoach = {
      ...user_,
      coachProfile: { ...updateCoachInput },
    };
    return await this.userRepository.save(updateCoach);
  }

  async delete({ userId }) {
    const user_ = await this.userRepository.findOne({ id: userId });
    console.log(`💛 user_.coachProfile: ${user_.coachProfile}`);

    const result = await this.coachprofileRepository.softDelete({
      id: user_.coachProfile.id,
    });

    console.log(`💛 delete result: ${result}`);
    return result.affected ? true : false;
  }
}
