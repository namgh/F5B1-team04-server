import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import { getRepository, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { Storage } from '@google-cloud/storage';
import { User } from '../user/entities/user.entity';

interface IFile {
  files: FileUpload[];
}

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogrepository: Repository<Blog>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.blogrepository.find();
  }

  async fetchotherBlogorderbylike() {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .orderBy('blog.like', 'DESC')
      .getMany();
  }

  async fetchotherBlogorderbycreateAt() {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .orderBy('blog.createAt', 'DESC')
      .getMany();
  }

  async fetchotherBlogorderbylikecreate() {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .orderBy('blog.like', 'DESC')
      .addOrderBy('blog.createAt', 'DESC')
      .getMany();
  }

  async findmyblog({ currentUser }) {
    const blog = await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    return blog;
  }

  async create({ title, contents, currentUser }) {
    const user = await this.userrepository.findOne({
      email: currentUser.email,
    });
    return await this.blogrepository.save({
      title,
      contents,
      user,
    });
  }

  async update({ title, contents, currentUser, blogid }) {
    const blog = await this.blogrepository.findOne({ id: blogid });

    return await this.blogrepository.save({
      ...blog,
      contents,
      title,
    });
  }

  async delete({ currentUser, blogid }) {
    const blog = await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('blog.id = :id', { id: blogid })
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    console.log('blog===========', blog);
    if (blog) {
      const result = await this.blogrepository.softDelete({
        id: blogid,
      });
      return result.affected ? true : false;
    }
    return null;
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
