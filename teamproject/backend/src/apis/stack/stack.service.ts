import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import { getRepository, Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
import { User } from '../user/entities/user.entity';
import { Stack } from './entities/stack.entity';
import { StackTag } from '../stacktag/entities/stacktag.entity';

interface IFile {
  files: FileUpload[];
}

@Injectable()
export class StackService {
  constructor(
    @InjectRepository(Stack)
    private readonly stackrepository: Repository<Stack>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,

    @InjectRepository(StackTag)
    private readonly stacktagrepository: Repository<StackTag>,
  ) {}

  async findAll() {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacktag', 'stacktag')
      .orderBy('stack.id', 'DESC')
      .getMany();
  }

  async fetchotherStackorderbylike() {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacktag', 'stacktag')
      .orderBy('stack.like', 'DESC')
      .getMany();
  }

  async fetchStackOnebystackid({ stackid }) {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacktag', 'stacktag')
      .where('stack.id = :id', { id: stackid })
      .getOne();
  }

  async fetchotherStackorderbycreateAt() {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacktag', 'stacktag')
      .orderBy('stack.createAt', 'DESC')
      .getMany();
  }

  async findmystack({ currentUser }) {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacktag', 'stacktag')
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

   
  }

  async create({ title, contents, currentUser, stacktag }) {
    const user = await this.userrepository.findOne({
      email: currentUser.email,
    });

    const stacktagresult = await Promise.all(
      stacktag.map(async (ele) => {
        const isstacktag = await this.stacktagrepository.findOne({
          tag: ele,
        });
        if (isstacktag) return isstacktag;
        else {
          return await this.stacktagrepository.save({
            tag: ele,
          });
        }
      }),
    );

    return await this.stackrepository.save({
      title,
      contents,
      user,
      stacktag: stacktagresult,
    });
  }

  async update({ title, contents, currentUser, stackid }) {
    const blog = await this.stackrepository.findOne({ id: stackid });

    return await this.stackrepository.save({
      ...blog,
      contents,
      title,
    });
  }

  async delete({ currentUser, stackid }) {
    const result = await this.stackrepository.softDelete({
      id: stackid,
    });
    return result.affected ? true : false;
  }

  async upload({ files }: IFile) {
    const storage = new Storage({
      keyFilename: 'fiery-surf-341008-9eb487c6b3f6.json',
      projectId: 'fiery-surf-341008',
    }).bucket('cu2image');

    const waitedfile = await Promise.all(files);

    const results = await Promise.all(
      waitedfile.map((file, i) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(
              storage.file(`thumb/${i}/${file.filename}`).createWriteStream(),
            )
            .on('finish', () => resolve(`thumb/${i}/${file.filename}`))
            .on('error', (error) => reject(error));
        });
      }),
    );
    return results;
  }
  async fetchstackbysearch({ search }) {
    return getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .leftJoinAndSelect('stack.stacktag', 'stacktag')
      .where('stack.title like :title', { title: '%' + search + '%' })
      .orWhere('stack.contents like :contents', {
        contents: '%' + search + '%',
      })
      .getMany();
  }
}
