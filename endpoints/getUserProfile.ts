import { Request, Response } from 'express';

import Authenticator from '../src/services/Authenticator';

import UserDatabase from '../data/UserDatabase';
import BaseDatabase from '../data/BaseDatabase';

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserById(authenticationData.id);

    res
      .status(200)
      .send({ message: `success`, id: user.id, email: user.email });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
