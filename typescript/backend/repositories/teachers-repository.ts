import { Teacher } from '../common/entities/teacher';
import { Externals } from '../context/production-context';
import { findById, findSingleRecord, findSingleRecordOrThrow } from '../utils/database-queries';
import { NotLoggedInError } from '../utils/errors';
import { withLogger } from '../utils/logger';

const TEACHERS_COLLECTION = 'TeachersProfile';

export class TeachersRepository {
  constructor(private readonly externals: Externals) {}

  public fetchTeacherById(id: string): Promise<Teacher | undefined> {
    return withLogger(`fetchTeacherById ${id}`, findById(this.externals, TEACHERS_COLLECTION, id));
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

  public fetchTeacherByEmailOrThrow(email: string | undefined): Promise<Teacher> {
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
          .find({ suppressAuth: true })
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

  public async updateTeacher(teacher: Teacher): Promise<Teacher> {
    return withLogger(
      `updateTeacher ${teacher.email}`,
      this.externals.wixData.update(TEACHERS_COLLECTION, teacher, {
        suppressAuth: true,
      })
    );
  }
}
