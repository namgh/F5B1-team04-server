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
    return await this.stackrepository.find();
  }

  async fetchotherStackorderbylike() {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .orderBy('stack.like', 'ASC')
      .getMany();
  }

  async fetchotherStackorderbycreateAt() {
    return await getRepository(Stack)
      .createQueryBuilder('stack')
      .orderBy('stack.createAt', 'ASC')
      .getMany();
  }

  async findmystack({ currentUser }) {
    const stack = await getRepository(Stack)
      .createQueryBuilder('stack')
      .leftJoinAndSelect('stack.user', 'user')
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    return stack;
  }

  async create({ title, contents, currentUser, stacktag }) {
    const user = await this.userrepository.findOne({
      email: currentUser.email,
    });

    const stacktagresult = stacktag.map(async (ele) => {
      const isstacktag = await this.stacktagrepository.findOne({
        tag: ele,
      });
      if (isstacktag) return isstacktag;
      else {
        return await this.stacktagrepository.save({
          tag: ele,
        });
      }
    });

    return await this.stackrepository.save({
      title,
      contents,
      user,
      stacktag: stacktagresult,
    });
  }

  async update({ title, contents, currentUser, blogid }) {
    const blog = await this.stackrepository.findOne({ id: blogid });

    return await this.stackrepository.save({
      ...blog,
      contents,
      title,
    });
  }

  async delete({ currentUser, blogid }) {
    const result = await this.stackrepository.softDelete({
      id: blogid,
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
            .on('finish', () => resolve(`cu2image/${file.filename}`))
            .on('error', (error) => reject(error));
        });
      }),
    );
    return results;
  }
}
