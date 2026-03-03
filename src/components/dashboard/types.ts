export interface Playground {
  id: string;
  title: string;
  description: string;
}

export interface GetPlaygroundsResponse {
  playgrounds: Playground[];
}

export interface CreatePlaygroundFormValues {
  title: string;
  description: string;
}
