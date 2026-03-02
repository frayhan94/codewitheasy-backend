import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type EnrollResult =
  | { success: true; enrollmentId: string }
  | { success: false; error: string; enrollmentId?: string };

async function enrollWithLock(
  userId: string,
  courseId: string
): Promise<EnrollResult> {
  const { data, error } = await supabase.rpc('enroll_user', {
    p_user_id: userId,
    p_course_id: courseId,
  });

  if (error) throw error;
  return data as EnrollResult;
}

export async function enrollUser(
  userId: string,
  courseId: string,
  maxRetries = 3
): Promise<EnrollResult> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await enrollWithLock(userId, courseId);
      if (!result.success && result.error === 'ALREADY_ENROLLED') {
        return result;
      }

      return result;

    } catch (error: any) {
      const isLockError =
        error?.code === '55P03' ||
        error?.message?.includes('LOCK_NOT_AVAILABLE');

      if (isLockError && attempt < maxRetries - 1) {
        attempt++;
        const delay = Math.pow(2, attempt) * 100;
        console.warn(`Lock conflict, retry ${attempt}/${maxRetries} in ${delay}ms`);
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      throw error;
    }
  }

  throw new Error('Failed to enroll after max retries');
}