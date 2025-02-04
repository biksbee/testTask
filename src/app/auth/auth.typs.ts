export type UsersLoginType = {
  email: string;
  password: string;
  fingerprint: string
}

export type CreateSession = {
  fingerprint: string;
  userId: number,
  token: string;
}