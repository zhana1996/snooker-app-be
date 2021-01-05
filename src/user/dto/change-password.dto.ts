import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    readonly newPassword: string;
}