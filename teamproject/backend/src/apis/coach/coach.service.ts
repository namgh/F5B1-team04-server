import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/common/auth/gql-user.param';
import { getRepository, Repository } from 'typeorm';
import { User, Role } from '../user/entities/user.entity';
import { UpdateCoachInput } from './dto/updateCoach.input';
import { CoachProfile } from './entities/coachprofile.entity';

interface IUpdateCoach {
  currentUser: ICurrentUser;
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
      where: { role: Role.COACH },
      relations: ['coachProfile'],
    });
  }

  async findMyCoachInfo({ currentUser }) {
    return await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['coachProfile'],
    });
  }

  async findOne({ userId }) {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['coachProfile'],
    });
  }

  async create({ currentUser, createProfileInput }) {
    const coachProfile = await this.coachprofileRepository.save({
      ...createProfileInput,
    });
    const user = await this.userRepository.findOne({ id: currentUser.id });
    return await this.userRepository.save({
      ...user,
      coachProfile,
      role: Role.COACH,
    });
  }

  async update({ currentUser, updateCoachInput }: IUpdateCoach) {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['coachProfile'],
    });
    const profile = await this.coachprofileRepository.findOne({
      where: { id: user.coachProfile.id },
    });
    return await this.userRepository.save({
      ...user,
      coachProfile: await this.coachprofileRepository.save({
        ...profile,
        ...updateCoachInput,
      }),
    });
  }

  async delete({ currentUser }) {
    const user_ = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['coachProfile'],
    });
    console.log(`💛 user_.coachProfile: ${user_.coachProfile}`);

    const result = await this.coachprofileRepository.softDelete({
      id: user_.coachProfile.id,
    });

    if (result.affected) {
      await this.userRepository.save({
        ...user_,
        role: Role.USER,
      });
      return true;
    }
    return false;
  }
}
