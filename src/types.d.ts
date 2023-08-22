// COMMENT
export type CommentUser = {
  image: {
    png: string;
    webp: string;
  };
  username: string;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: CommentUser;
  replies?: Comment[];
};