import { IsDateString, IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateWorkshopDto {
  @IsString() @Length(1, 200) title!: string;
  @IsString() @Length(1, 1000) descr!: string;
  @IsDateString() date!: string;
  @IsInt() @IsPositive() capacity!: number;
  @IsInt() @IsPositive() classroom!: number;
}
