
export interface ParsedToken {
  readonly id: number;
}

export interface AuthRequest {
  parsedToken: ParsedToken
}