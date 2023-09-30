/* eslint-disable @typescript-eslint/no-explicit-any */
import {UserCredentials} from '../Shared/model';
import * as Nedb from 'nedb';
import {SessionToken} from '../Server/Model';

export class SessionTokenDbAcc {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/SessionToken.db');
    this.nedb.loadDatabase();
  }

  public async store_sess_token(token: SessionToken): Promise<void> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(token, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async get_token(tokenId: string): Promise<SessionToken | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({tokenId: tokenId}, (err: Error, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length == 0) {
            return undefined;
          } else {
            resolve(docs[0]);
          }
        }
      });
    });
  }
}
