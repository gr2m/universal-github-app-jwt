export type Options = {
  id: number;
  privateKey: string;
  now?: number;
};

export type Result = {
  appId: number;
  expiration: number;
  token: string;
};

export default function githubAppJwt(options: Options): Promise<Result>;
