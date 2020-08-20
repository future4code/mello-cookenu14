import BaseDatabase from './BaseDatabase';

export default class RecipeDatabase extends BaseDatabase {
  private static TABLE_NAME: string = 'recipes';

  public async createRecipe(
    id: string,
    user_id: string,
    title: string,
    description: string,
    createdAt: Date
  ): Promise<void> {
    await this.getConnection()
      .insert({ id, user_id, title, description, createdAt })
      .into(RecipeDatabase.TABLE_NAME);
  }

  public async getRecipeById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select('*')
      .from(RecipeDatabase.TABLE_NAME)
      .where({ id });

    return result[0];
  }
}
