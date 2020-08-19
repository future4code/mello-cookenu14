import { Request, Response } from 'express';

import BaseDatabase from '../data/BaseDatabase';
import UserDatabase from '../data/UserDatabase';

import Authenticator from '../src/services/Authenticator';
import HashManager from '../src/services/HashManager';
import IdGenerator from '../src/services/IdGenerator';

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error(`Insert all required information: name, email, password`);
    }

    if (email.indexOf('@') === -1) {
      throw new Error(`Invalid email`);
    }

    if (password.length < 6) {
      throw new Error(`The password must contain at least 6 characters`);
    }

    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(password);

    const userDatabase = new UserDatabase();
    await userDatabase.createUser(id, name, email, hashPassword);

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id });

    res.status(200).send({ message: `User created succesfully`, token });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
