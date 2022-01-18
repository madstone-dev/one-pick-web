import { Menu } from "@headlessui/react";
import Link from "next/link";
import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";
import UserRoleChangeButton from "./UserRoleChangeButton";
import DropdownMenu from "../DropdownMenu";

interface IquestionDropdown {
  user: searchUsers_searchUsers_users;
}

export default function UserDropdown({ user }: IquestionDropdown) {
  return (
    <DropdownMenu>
      <Menu.Item>
        <Link href={`/users/${user.id}`}>
          <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            보기
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <div>
          <UserRoleChangeButton user={user} />
        </div>
      </Menu.Item>
    </DropdownMenu>
  );
}
