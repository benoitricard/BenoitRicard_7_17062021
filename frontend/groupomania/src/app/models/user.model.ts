export interface User {
  id: number;
  token: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  jobTitle: string;
  biography: string;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
}
