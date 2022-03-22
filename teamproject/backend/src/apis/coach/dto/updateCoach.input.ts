import { InputType, OmitType } from '@nestjs/graphql';
import { CoachProfile } from '../entities/coachprofile.entity';

@InputType()
export class UpdateCoachInput extends OmitType(
  CoachProfile,
  ['id', 'orgName', 'orgType', 'orgEmail'],
  InputType,
) {}
