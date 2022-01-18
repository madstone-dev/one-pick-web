import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { routes } from "../src/routes";
import { getAvatar } from "../src/utils/auth.utils";
import { me } from "../src/__generated__/me";
import LogoutButton from "./auth/LogoutButton";

interface IheaderUserNav {
  user: me | undefined;
}

export default function HeaderUserNav({ user }: IheaderUserNav) {
  const userNavs = [{ name: "내 정보", href: `/users/${user?.me?.id}` }];

  return user?.me ? (
    <div className="flex items-center">
      <div className="flex items-center flex-shrink-0">
        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>

              <img
                className="object-cover rounded-full w-9 h-9"
                src={
                  user?.me?.avatar?.Location || getAvatar(user?.me?.username)
                }
                alt={`${user?.me?.username}'s profile`}
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none">
              {user?.me?.role === "admin" && (
                <Menu.Item>
                  <Link href={routes.adminMenu}>
                    <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
                      관리자 메뉴
                    </a>
                  </Link>
                </Menu.Item>
              )}

              {userNavs.map((item) => (
                <Menu.Item key={item.name}>
                  <Link href={item.href}>
                    <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
                      {item.name}
                    </a>
                  </Link>
                </Menu.Item>
              ))}
              <Menu.Item>
                <div>
                  <LogoutButton />
                </div>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  ) : (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Link href={routes.login}>
          <a className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
            <span>로그인</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
