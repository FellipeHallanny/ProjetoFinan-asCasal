import { UserRepository } from '@/repositories/UserRepository';
import { FamilyRepository } from '@/repositories/FamilyRepository';
import { NotFoundError } from '@/types/errors';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly familyRepository: FamilyRepository
  ) {}

  async createSpace(uid: string, email: string | undefined, familyName: string) {
    await this.userRepository.createUser(uid, { email, createdAt: new Date().toISOString() });
    
    const familyId = await this.familyRepository.createFamily(familyName, uid);
    await this.userRepository.updateUserFamily(uid, familyId);
    
    return { familyId, familyName };
  }

  async joinSpace(uid: string, email: string | undefined, inviteCode: string) {
    await this.userRepository.createUser(uid, { email, createdAt: new Date().toISOString() });

    const family = await this.familyRepository.getFamilyByInviteCode(inviteCode);
    if (!family) {
      throw new NotFoundError('Family workspace not found or invalid invite code');
    }

    await this.familyRepository.addUserToFamily(family.id, uid);
    await this.userRepository.updateUserFamily(uid, family.id);
    
    return { familyId: family.id, familyName: (family as any).name };
  }
}
