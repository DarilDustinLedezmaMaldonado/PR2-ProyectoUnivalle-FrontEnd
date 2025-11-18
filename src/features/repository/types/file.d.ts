export interface File {
  _id: number;
  filename: string;
  uploadDate: string;
  url?: string;
  contentType?: string;
  metadata: {
    title: string;
    author: string;
    description: string;
    tags: string[];
    importance: string;
    privacy: string;
    url?: string;
  };
}