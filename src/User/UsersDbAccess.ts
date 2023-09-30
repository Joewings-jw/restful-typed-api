/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Nedb from 'nedb';
import {User} from '../Shared/model';

export class UsersDbAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/Users.db');
    this.nedb.loadDatabase();
  }

  public async put_user(user: User): Promise<void> {
    if (!user.id) {
      user.id = this.gen_userId();
    }
    return new Promise((resolve, reject) => {
      this.nedb.insert(user, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async get_userById(userId: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({id: userId}, (err: Error, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length == 0) {
            resolve(undefined);
          } else {
            resolve(docs[0]);
          }
        }
      });
    });
  }

  public async get_userByName(name: string): Promise<User[]> {
    const reg_ex = new RegExp(name);
    return new Promise((resolve, reject) => {
      this.nedb.find({name: reg_ex}, (err: Error, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  // reload database after deleting user
  public async delete_user(userId: string): Promise<boolean> {
    const operation_succ = await this.delete_user_db(userId);
    this.nedb.loadDatabase();
    return operation_succ;
  }
  private async delete_user_db(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.nedb.remove(
        {id: userId},
        (err: Error | null, removed_number: number) => {
          if (err) {
            reject(err);
          } else {
            if (removed_number == 0) {
              resolve(false);
            } else {
              resolve(true);
            }
          }
        }
      );
    });
  }
  private gen_userId() {
    return Math.random().toString(36).slice(2);
  }
}
