export interface Book {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
}

export interface BookAuthor {
  id: number;
  fullName: string;
}

export interface BookDetails extends Book {
  authors: BookAuthor[];
}

export interface BookRequest {
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
}
