import { Request, Response } from 'express';
import Authenticator from '../src/services/Authenticator';
import UserDatabase from '../data/UserDatabase';
import RecipeDatabase from '../data/RecipeDatabase';
import IdGenerator from '../src/services/IdGenerator';

export const createRecipe = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = userDatabase.getUserById(authenticationData.id);

    if (!user) {
      throw new Error(`Invalid token`);
    }

    const { title, description } = req.body;

    if (!title || !description) {
      throw new Error(`Insert all required information: title and description`);
    }

    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const createdAt = new Date();

    const recipeDatabase = new RecipeDatabase();
    await recipeDatabase.createRecipe(
      id,
      authenticationData.id,
      title,
      description,
      createdAt
    );

    res.status(200).send({ message: `Recipe created successfully` });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  }
};
