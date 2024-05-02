export type Options = {
  id: number | string;
  privateKey: string;
  now?: number;
};

export type Result = {
  appId: number | string;
  expiration: number;
  token: string;
};

export default function githubAppJwt(options: Options): Promise<Result>;
