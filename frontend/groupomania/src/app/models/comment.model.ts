import { Post } from './post.model';
import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  user_id: User['id'];
  post_id: Post['id'];
  createdAt: Date;
  updatedAt: Date;
}
