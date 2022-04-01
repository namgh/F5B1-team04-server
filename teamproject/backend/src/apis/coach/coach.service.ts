import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUser } from 'src/common/auth/gql-user.param';
import { getRepository, Repository } from 'typeorm';
import { BlogTag } from '../blogtag/entities/blogtag.entity';
import { CoachTag } from '../coachtag/coachtag.entities/coachtag.entity';
// import { CoachTag } from '../coachtag/entities/coachtag.entity';
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

    @InjectRepository(CoachTag)
    private readonly coachtagrepository: Repository<CoachTag>,
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
    return await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.coachProfile', 'coachprofile')
      .leftJoinAndSelect('user.coachtag', 'coachtag')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async create({ currentUser, createProfileInput, stacktag }) {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['coachProfile'],
    });
    const coachProfile = await this.coachprofileRepository.save({
      id: user.coachProfile.id,
      ...createProfileInput,
    });
    const stacktagresult = await Promise.all(
      stacktag.map(async (ele) => {
        const isblogtag = await this.coachtagrepository.findOne({
          tag: ele,
        });
        if (isblogtag) return isblogtag;
        else {
          return await this.coachtagrepository.save({
            tag: ele,
          });
        }
      }),
    );

    return await this.userRepository.save({
      ...user,
      coachProfile: coachProfile,
      role: Role.COACH,
      coachtag: stacktagresult,
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
