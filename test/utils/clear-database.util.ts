import { Session } from '../../src/auth/models/auth.model';
import { User } from '../../src/user/models/user.model';

export async function clearDatabase() {
  await Session.deleteMany();
  await User.deleteMany();
}
