import { Request, Response } from 'express';

import BaseDatabase from '../data/BaseDatabase';
import UserDatabase from '../data/UserDatabase';

import Authenticator from '../src/services/Authenticator';
import HashManager from '../src/services/HashManager';

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserByEmail(email);

    const hashManager = new HashManager();
    const isPasswordCorrect = await hashManager.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error(`email or password incorrect`);
    }

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id: user.id });

    res.status(200).send({ message: `Signed in successfully`, token });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
