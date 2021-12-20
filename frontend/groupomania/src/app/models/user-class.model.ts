import { PostClass } from './post-class.model';

export class UserClass {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public profilePicture: string;
  public jobTitle: string;
  public biography: string;
  public birthday: Date;
  public createdAt: Date;
  public updatedAt: Date;
  public lastConnexion: Date;
  public isAdmin: number;
  public Post: PostClass[];

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profilePicture: string,
    jobTitle: string,
    biography: string,
    birthday: Date,
    createdAt: Date,
    updatedAt: Date,
    lastConnexion: Date,
    isAdmin: number,
    Post: PostClass[]
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
    this.jobTitle = jobTitle;
    this.biography = biography;
    this.birthday = birthday;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastConnexion = lastConnexion;
    this.isAdmin = isAdmin;
    this.Post = Post;
  }
}
