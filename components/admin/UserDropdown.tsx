import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";
import UserRoleChangeButton from "./UserRoleChangeButton";

interface IquestionDropdown {
  user: searchUsers_searchUsers_users;
  isLast: boolean;
}

export default function UserDropdown({ user, isLast }: IquestionDropdown) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center p-2 rounded-full sm:text-gray-600 bg-opacity-10 hover:bg-gray-100 sm:hover:text-gray-700 focus:outline-none">
          <span className="sr-only">Open options</span>
          <DotsVerticalIcon className="w-5 h-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`${
            isLast ? "mr-2 bottom-0 right-full" : "mt-2"
          } absolute right-0 z-10 origin-top-right bg-white rounded-md shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="py-1">
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
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
