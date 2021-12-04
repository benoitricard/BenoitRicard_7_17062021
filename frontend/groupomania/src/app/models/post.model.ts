import { User } from './user.model';

export interface Post {
  id: number;
  nbOfLikes: number;
  user_id: User['id'];
  content: string;
  attachment: string;
  createdAt: Date;
  updatedAt: Date;
}
