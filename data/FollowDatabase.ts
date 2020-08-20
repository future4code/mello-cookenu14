import BaseDatabase from "./BaseDatabase";

export default class FollowDatabase extends BaseDatabase {
  private static TABLE_NAME: string = "follows";

  public async followUser(
    follower_id: string,
    followed_id: string
  ): Promise<void> {
    await this.getConnection()
      .insert({ follower_id, followed_id })
      .into(FollowDatabase.TABLE_NAME);
  }

  public async unFollowUser(
    follower_id: string,
    followed_id: string
  ): Promise<void> {
    await this.getConnection()
      .del()
      .from(FollowDatabase.TABLE_NAME)
      .where(follower_id === follower_id)
      .where(followed_id === followed_id);
  }
}
