import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto): Promise<User> {
    if (await this.users.findOne({ where: { username: dto.username } })) throw new ConflictException('Пользователь с таким username уже существует.');
    const user = this.users.create({ username: dto.username, password: await bcrypt.hash(dto.password, 12), role: UserRole.USER });
    return this.users.save(user);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.users.findOne({ where: { username: dto.username } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException('Неверный username или пароль.');
    return { access_token: await this.jwt.signAsync({ sub: user.id, username: user.username, role: user.role }) };
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('Пользователь не найден.');
    return user;
  }
}
