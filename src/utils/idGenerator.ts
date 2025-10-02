import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a UUID
 * @returns Generated UUID string
 */
export const generateUuid = (): string => {
  return uuidv4();
};
