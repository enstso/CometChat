import type { User } from "../../gql/graphql";

export type SearchBarType = {
user:User;
onCreate:(userId: string, title: string | null) => void;
disabled?:boolean;
}