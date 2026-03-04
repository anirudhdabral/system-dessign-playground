export interface Playground {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
}

export interface GetPlaygroundsResponse {
  playgrounds: Playground[];
}

export interface CreatePlaygroundFormValues {
  title: string;
  description: string;
}
