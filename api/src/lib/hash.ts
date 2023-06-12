import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './env'

const rounds = SALT_ROUNDS

export async function hashWord(word: string): Promise<string> {
	return bcrypt.hash(word, rounds)
}

export async function compareWord(word: string, hash: string): Promise<boolean> {
	return bcrypt.compare(word, hash)
}

export function compareWordSync(word: string, hash: string): boolean {
	return bcrypt.compareSync(word, hash)
}
