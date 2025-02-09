export interface RequestParams extends RequestInit {
  endpoint: string;
  body?: BodyInit | null;
  queryParams?: Record<string, string>;
}
