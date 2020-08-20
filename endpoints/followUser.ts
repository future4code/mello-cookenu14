import { Request, Response } from "express";

import Authenticator from "../src/services/Authenticator";

import UserDatabase from "../data/UserDatabase";
import BaseDatabase from "../data/BaseDatabase";
import FollowDatabase from "../data/FollowDatabase";

export const followUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserById(authenticationData.id);

    if (!user) {
      throw new Error(`Invalid token`);
    }

    const userToFollowId = req.body.userToFollowId;
    const userToFollow = await userDatabase.getUserById(userToFollowId);

    if (!userToFollow) {
      throw new Error(`User not found`);
    }

    const followDatabase = new FollowDatabase();
    await followDatabase.followUser(authenticationData.id, userToFollowId);

    res.status(200).send({
      message: `User followed successfully`,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
