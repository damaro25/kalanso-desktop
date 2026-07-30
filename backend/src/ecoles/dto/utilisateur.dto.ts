import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleUtilisateur } from '../../common/enums';

export class CreateUtilisateurDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RoleUtilisateur)
  role: RoleUtilisateur;

  @IsOptional()
  @IsString()
  personnelId?: string;
}
