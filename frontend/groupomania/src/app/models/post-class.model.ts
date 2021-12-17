import { CommentClass } from './comment-class.model';
import { UserClass } from './user-class.model';

export class PostClass {
  public id: number;
  public nbOfLikes: number;
  public user_id: number;
  public content: string;
  public attachment: string;
  public createdAt: Date;
  public updatedAt: Date;
  public User: UserClass;
  public Comments: CommentClass[];

  constructor(
    id: number,
    nbOfLikes: number,
    user_id: number,
    content: string,
    attachment: string,
    createdAt: Date,
    updatedAt: Date,
    User: UserClass,
    Comments: CommentClass[]
  ) {
    this.id = id;
    this.nbOfLikes = nbOfLikes;
    this.user_id = user_id;
    this.content = content;
    this.attachment = attachment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.User = User;
    this.Comments = Comments;
  }
}
