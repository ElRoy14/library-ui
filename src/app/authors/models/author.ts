export interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
  fullName: string;
  booksCount: number;
}

export interface AuthorRequest {
  idBook: number;
  firstName: string;
  lastName: string;
}
