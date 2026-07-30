import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class InitialiserDto {
  @IsString()
  nomEcole: string;

  @IsOptional()
  @IsString()
  villeEcole?: string;

  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
