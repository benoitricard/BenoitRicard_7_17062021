import { PostClass } from './post-class.model';
import { UserClass } from './user-class.model';

export class CommentClass {
  public id: number;
  public user_id: number;
  public post_id: number;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;
  public Post: PostClass;
  public User: UserClass;

  constructor(
    id: number,
    user_id: number,
    post_id: number,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    Post: PostClass,
    User: UserClass
  ) {
    this.id = id;
    this.user_id = user_id;
    this.post_id = post_id;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.Post = Post;
    this.User = User;
  }
}
