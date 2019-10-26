export class JsonResponse {
  readonly code: number;
  readonly message?: string;
  readonly data?: Object;
  readonly timestamp?: number;
  readonly [propName: string]: any;

  constructor(partial: Partial<JsonResponse>) {
    Object.assign(this, partial);
  }
}
