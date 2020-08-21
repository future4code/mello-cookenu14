import BaseDatabase from "./BaseDatabase";

export default class FeedDatabase extends BaseDatabase {
  private static TABLE_NAME: string = "users";

  public async getUserFeed(follower_id: string): Promise<any> {
    const result = await this.getConnection().raw(
      `
        SELECT 
          recipes.id, 
          recipes.title, 
          recipes.description, 
          recipes.createdAt, 
          recipes.user_id, 
          recipes.user_name 
        FROM users
        JOIN follows on follows.follower_id = "${follower_id}"
        INNER JOIN recipes ON recipes.user_id = follows.followed_id
        WHERE users.id = follows.follower_id;
      `
    );

    return result[0];
  }
}
