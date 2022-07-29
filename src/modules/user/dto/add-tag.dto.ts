import { IsNumberString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddTagDto {
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  tags!: number[];
}
