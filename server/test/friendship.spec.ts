import { createFriendshipsRepoMock, createUsersRepo } from "./mocks";
import { friendshipsLogic } from "../src/logic/friendships";

describe("Friendship", () => {
  it("should allow to create a friendship when it doesn't exists", async () => {
    const friendships = friendshipsLogic({
      friendshipsRepo: createFriendshipsRepoMock(),
      usersRepo: createUsersRepo(),
    });
    const friendship = { userAddress1: "foo", userAddress2: "bar" };

    await friendships.create(friendship);

    const allFriendships = await friendships.getAll();

    expect(allFriendships).toHaveLength(1);
    expect(allFriendships[0]).toEqual(friendship);
  });

  it("should not allow to create a friendship when it exists, independently of the order", async () => {
    const friendships = friendshipsLogic({
      friendshipsRepo: createFriendshipsRepoMock(),
      usersRepo: createUsersRepo(),
    });
    const friendship = { userAddress1: "foo", userAddress2: "bar" };

    await friendships.create(friendship);

    await expect(friendships.create(friendship)).rejects.toThrow(
      "The friendship already exists"
    );
    await expect(
      friendships.create({
        userAddress1: friendship.userAddress2,
        userAddress2: friendship.userAddress1,
      })
    ).rejects.toThrow("The friendship already exists");
  });
});
