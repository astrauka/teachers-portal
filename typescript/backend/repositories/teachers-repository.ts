import { Externals } from '../context/production-context';
import { Teacher, TeacherWithMinimalData } from '../universal/entities/teacher';
import {
  findById,
  findByIdOrThrow,
  findSingleRecord,
  findSingleRecordOrThrow,
} from '../utils/database-queries';
import { NotLoggedInError } from '../utils/errors';
import { withLogger } from '../utils/logger';

const TEACHERS_COLLECTION = 'TeachersProfile';

export class TeachersRepository {
  constructor(private readonly externals: Externals) {}

  public fetchTeacherById(id: string): Promise<Teacher | undefined> {
    return withLogger(`fetchTeacherById ${id}`, findById(this.externals, TEACHERS_COLLECTION, id));
  }

  public fetchTeacherByIdOrThrow(id: string): Promise<Teacher> {
    return withLogger(
      `fetchTeacherByIdOrThrow ${id}`,
      findByIdOrThrow(this.externals, TEACHERS_COLLECTION, id)
    );
  }

  public fetchTeacherByEmail(email: string | undefined): Promise<Teacher | undefined> {
    if (email) {
      return withLogger(
        `fetchTeacherByEmail ${email}`,
        findSingleRecord(
          this.externals.wixData
            .query(TEACHERS_COLLECTION)
            .eq('email', email)
            .limit(1)
            .find({ suppressAuth: true })
        )
      );
    }
    return undefined;
  }

  public fetchTeacherByEmailOrThrow(
    email: string | undefined,
    returnPrivateFields: boolean
  ): Promise<Teacher> {
    if (!email) {
      throw new NotLoggedInError();
    }
    return withLogger(
      `fetchTeacherByEmail ${email}`,
      findSingleRecordOrThrow(
        this.externals.wixData
          .query(TEACHERS_COLLECTION)
          .eq('email', email)
          .limit(1)
          .find({ suppressAuth: true, suppressHooks: returnPrivateFields })
      )
    );
  }

  public fetchTeacherBySlug(slug: string): Promise<Teacher | undefined> {
    if (slug) {
      return withLogger(
        `fetchTeacherBySlug ${slug}`,
        findSingleRecord(
          this.externals.wixData
            .query(TEACHERS_COLLECTION)
            .eq('slug', slug)
            .limit(1)
            .find({ suppressAuth: true })
        )
      );
    }
    return undefined;
  }

  public async updateTeacher(teacher: TeacherWithMinimalData): Promise<Teacher> {
    return withLogger(
      `updateTeacher ${teacher.email}`,
      this.externals.wixData.update(TEACHERS_COLLECTION, teacher, {
        suppressAuth: true,
      })
    );
  }

  public async removeTeacherByEmail(email: string): Promise<void> {
    const teacher = await this.fetchTeacherByEmail(email);
    if (teacher) {
      return withLogger(
        `removeTeacherByEmail ${email}`,
        this.externals.wixData.remove(TEACHERS_COLLECTION, teacher._id, { suppressAuth: true })
      );
    }
  }

  public async createTeacher(teacher: TeacherWithMinimalData): Promise<Teacher> {
    return withLogger(
      `createTeacher ${teacher.email}`,
      this.externals.wixData.insert(TEACHERS_COLLECTION, teacher, { suppressAuth: true })
    );
  }
}
