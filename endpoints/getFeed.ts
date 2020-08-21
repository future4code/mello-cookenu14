import { Request, Response } from "express";

import Authenticator from "../src/services/Authenticator";

import UserDatabase from "../data/UserDatabase";
import BaseDatabase from "../data/BaseDatabase";
import FeedDatabase from "../data/FeedDatabase";

export const getFeed = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserById(authenticationData.id);

    if (!user) {
      throw new Error(`Invalid token`);
    }

    const feedDatabase = new FeedDatabase();
    const result = await feedDatabase.getUserFeed(authenticationData.id);

    res.status(200).send({
      result,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
