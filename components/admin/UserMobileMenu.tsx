import { useState } from "react";
import Link from "next/link";
import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";
import UserRoleChangeButton from "./UserRoleChangeButton";
import MobileMenu from "../MobileMenu";

interface IuserMobileMenu {
  user: searchUsers_searchUsers_users;
}

export default function UserMobileMenu({ user }: IuserMobileMenu) {
  const [open, setOpen] = useState(false);

  return (
    <MobileMenu title="유저 메뉴" open={open} setOpen={setOpen}>
      <li className="w-full">
        <Link href={`/users/${user.id}`}>
          <a className="block w-full px-4 py-2 text-base font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            보기
          </a>
        </Link>
      </li>
      <li className="w-full">
        <UserRoleChangeButton
          user={user}
          fontSize="text-base font-medium"
          setOpen={setOpen}
        />
      </li>
    </MobileMenu>
  );
}
