import { LoginDto } from '@ab/api/users/models/login.dto';
import { RegisterDto } from '@ab/api/users/models/register.dto';

export const inputRegisterUser: RegisterDto = {
  name: 'Test User',
  email: 'test.user@test.dev',
  password: 'Password@0',
  role: 'traveler',
};

export const unprocessableRegisterUser: RegisterDto = {
  ...inputRegisterUser,
  email: 'test.usertest.dev',
};

export const inputLoginUser: LoginDto = {
  email: inputRegisterUser.email,
  password: inputRegisterUser.password,
};

export const unprocessableLoginUser: LoginDto = {
  email: 'non.valid.test.dev',
  password: inputRegisterUser.password,
};

export const unauthorizedLoginUser: LoginDto = {
  email: 'unauthorized@test.dev',
  password: inputRegisterUser.password,
};

export const unauthorizedLoginPassword: LoginDto = {
  email: inputRegisterUser.email,
  password: 'invalidPassword',
};
