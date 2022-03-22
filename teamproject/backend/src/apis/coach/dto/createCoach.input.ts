import { InputType, OmitType } from '@nestjs/graphql';
import { CoachProfile } from '../entities/coachprofile.entity';

@InputType()
export class CreateCoachProfileInput extends OmitType(
  CoachProfile,
  ['id'],
  InputType,
) {}
