import User from '../models/user.model';
import { IUser } from '../types/user';

export const searchUsers = async (
  searchText: string,
): Promise<{ total: number; users: IUser[] }> => {
  const pipeline: any[] = [
    {
      $search: {
        index: 'project-2.users',
        text: {
          query: searchText,
          path: ['name', 'email'],
          fuzzy: {}
        }
      }
    },
    {
      $project: {
        name: 1,
        email: 1
      }
    }
  ];

  const users = await User.aggregate(pipeline);

  return {
    total: users.length,
    users
  };
};