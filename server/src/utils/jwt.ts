import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

const jwtSign = (
  payload: string | object | Buffer,
  secret: any,
  options: jwt.SignOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token!);
    });
  });
};

const jwtVerify = (
  token: string,
  secret: string,
  options?: jwt.VerifyOptions | undefined
) =>
  new Promise(
    (
      resolve: (
        value:
          | {
              username: string;
              id: string;
            }
          | PromiseLike<{
              username: string;
              id: string;
            }>
      ) => void,
      reject: (reason: Error) => void
    ) => {
      jwt.verify(token, secret, options, (err, decoded: any) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    }
  );

export { jwtSign, jwtVerify };
