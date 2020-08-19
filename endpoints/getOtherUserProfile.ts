import { Request, Response } from 'express';

import Authenticator from '../src/services/Authenticator';

import UserDatabase from '../data/UserDatabase';
import BaseDatabase from '../data/BaseDatabase';

export const getOtherUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserById(authenticationData.id);

    if (!user) {
      throw new Error(`Invalid token`);
    }

    const requestedUserId = req.params.id;
    const requestedUser = await userDatabase.getUserById(requestedUserId);

    if (!requestedUser) {
      throw new Error(`User not found`);
    }

    res.status(200).send({
      id: requestedUser.id,
      name: requestedUser.name,
      email: requestedUser.email,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
