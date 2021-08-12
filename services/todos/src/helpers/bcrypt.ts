import bcrypt from 'bcryptjs';

export function generateHash(value: string) {
  return bcrypt.hashSync(value);
}

export function validatetHash(value: string, hash: string) {
  return bcrypt.compareSync(value, hash);
}
