import { Role } from './role.enum';

/**
 * The internal User object
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
