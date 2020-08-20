import { Request, Response } from 'express';

import Authenticator from '../src/services/Authenticator';

import UserDatabase from '../data/UserDatabase';
import BaseDatabase from '../data/BaseDatabase';
import RecipeDatabase from '../data/RecipeDatabase';

export const getRecipe = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authenticationData = authenticator.getData(token);

    const userDatabase = new UserDatabase();
    const user = await userDatabase.getUserById(authenticationData.id);

    if (!user) {
      throw new Error(`Invalid token`);
    }

    const requestedRecipeId = req.params.id;
    const recipeDatabase = new RecipeDatabase();
    const requestedRecipe = await recipeDatabase.getRecipeById(
      requestedRecipeId
    );

    if (!requestedRecipe) {
      throw new Error(`Recipe not found`);
    }

    res.status(200).send({
      id: requestedRecipe.id,
      title: requestedRecipe.title,
      description: requestedRecipe.description,
      createdAt: requestedRecipe.createdAt,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: error.message, sqlMessage: error.sqlMessage });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
