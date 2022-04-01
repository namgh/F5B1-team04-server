import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import { getRepository, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { Storage } from '@google-cloud/storage';
import { User } from '../user/entities/user.entity';
import { MainStack } from '../mainstack/entities/mainstack.entity';
import { BlogTag } from '../blogtag/entities/blogtag.entity';
import { BlogCategoryTag } from '../blogcategorytag/entities/blogcategofytag.entity';

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

    @InjectRepository(MainStack)
    private readonly mainstackrepository: Repository<MainStack>,

    @InjectRepository(BlogTag)
    private readonly blogtagrepository: Repository<BlogTag>,

    @InjectRepository(BlogCategoryTag)
    private readonly blogcategorytagrepository: Repository<BlogCategoryTag>,
  ) {}

  async findAll() {
    return await this.blogrepository.find();
  }

  async fetchotherBlogorderbylike() {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.blogtag', 'blogtag')
      .leftJoinAndSelect('blog.blogcategorytag', 'blogcategorytag')
      .orderBy('blog.like', 'DESC')
      .getMany();
  }

  async fetchotherBlogorderbycreateAt() {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.blogtag', 'blogtag')
      .leftJoinAndSelect('blog.blogcategorytag', 'blogcategorytag')
      .orderBy('blog.createAt', 'DESC')
      .getMany();
  }

  async findmyblog({ currentUser }) {
    const blog = await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.blogtag', 'blogtag')
      .leftJoinAndSelect('blog.blogcategorytag', 'blogcategorytag')
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    return blog;
  }

  async create({ title, contents, currentUser, blogtag, blogcategorytag }) {
    const user = await this.userrepository.findOne({
      email: currentUser.email,
    });

    const mainstack = await getRepository(MainStack)
      .createQueryBuilder('mainstack')
      .leftJoinAndSelect('mainstack.user', 'user')
      .where('user.id = :id', { id: currentUser.id })
      .getOne();

    blogtag.forEach((ele) => {
      for (const key in mainstack) {
        console.log(key, mainstack[key], ele);

        if (key === ele) {
          mainstack[key] += 1;
        }
      }
    });

    await this.mainstackrepository.save(mainstack);

    const blogtagresult = await Promise.all(
      blogtag.map(async (ele) => {
        const isblogtag = await this.blogtagrepository.findOne({
          tag: ele,
        });
        if (isblogtag) return isblogtag;
        else {
          return await this.blogtagrepository.save({
            tag: ele,
          });
        }
      }),
    );

    const blogcategorytagresult = await Promise.all(
      blogcategorytag.map(async (ele) => {
        const isblogtag = await this.blogcategorytagrepository.findOne({
          tag: ele,
        });
        if (isblogtag) return isblogtag;
        else {
          return await this.blogcategorytagrepository.save({
            tag: ele,
          });
        }
      }),
    );

    return await this.blogrepository.save({
      title,
      contents,
      user,
      blogtag: blogtagresult,
      blogcategorytag: blogcategorytagresult,
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

  async mydelete({ currentUser, blogid }) {
    const blog = await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.blogtag', 'blogtag')
      .leftJoinAndSelect('blog.blogcategorytag', 'blogcategorytag')
      .where('blog.id = :id', { id: blogid })
      .andWhere('user.id = :id', { id: currentUser.id })
      .getMany();

    if (blog) {
      const result = await this.blogrepository.softDelete({
        id: blogid,
      });
      return result.affected ? true : false;
    }
    return null;
  }

  async delete({ blogid }) {
    const result = await this.blogrepository.softDelete({
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

  async findone({ blogid }) {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .leftJoinAndSelect('blog.blogtag', 'blogtag')
      .leftJoinAndSelect('blog.blogcategorytag', 'blogcategorytag')
      .andWhere('blog.id = :id', { id: blogid })
      .getOne();
  }
}
