import { IsString, Length } from 'class-validator';

export class CreateClassroomDto {
  @IsString() @Length(1, 100) name!: string;
  @IsString() @Length(1, 300) address!: string;
}
