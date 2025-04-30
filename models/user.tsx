import Friend from "./friend.js";

export default class User {
    name: string | undefined;
    surname: string | undefined;
    userName: string | undefined;
    image: string | undefined;
    profileId: string | undefined;
    friends: Array<Friend> | undefined;
}