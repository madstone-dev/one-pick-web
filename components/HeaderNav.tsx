import { Fragment, useEffect, useRef } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { routes } from "../src/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  ACCESS_TOKEN,
  getAvatar,
  headerHeightVar,
} from "../src/utils/auth.utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames } from "../src/utils/utils";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { me } from "../src/__generated__/me";

interface IheaderNav {
  user: me | undefined;
}

export default function HeaderNav({ user }: IheaderNav) {
  const headerRef = useRef<any>();
  const router = useRouter();
  const userLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    router.push(routes.logout);
  };
  const onBackClick = () => {
    router.back();
  };

  const headerNavs = [{ name: "홈", href: routes.home }];
  const userNavs = [{ name: "내 정보", href: `/users/${user?.me?.id}` }];

  useEffect(() => {
    headerHeightVar(headerRef.current.clientHeight);
  }, []);

  return (
    <div ref={headerRef} className="sticky top-0 z-50 ">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  {router.pathname !== routes.home ? (
                    <div className="p-2 rounded-full" onClick={onBackClick}>
                      <ChevronLeftIcon
                        className="w-6 h-6 text-white sm:w-8 sm:h-8 md:hidden"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full" onClick={onBackClick}>
                      <ChevronLeftIcon
                        className="w-6 h-6 text-white opacity-0 pointer-events-none sm:w-8 sm:h-8 sm:hidden"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <Disclosure.Button>
                    <Link href={routes.home}>
                      <a className="items-center flex-shrink-0 hidden text-white md:flex">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="relative mr-3 text-2xl"
                        />
                        <span className="text-xl font-semibold">
                          One Pick !
                        </span>
                      </a>
                    </Link>
                  </Disclosure.Button>
                  <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                    {headerNavs.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={
                          item.href === router.pathname ? "page" : undefined
                        }
                      >
                        <a
                          className={classNames(
                            item.href === router.pathname
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center md:hidden">
                  <Link href={routes.home}>
                    <a className="items-center flex-shrink-0 text-white ">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="relative mr-3 text-2xl"
                      />
                      <span className="text-xl font-semibold">One Pick !</span>
                    </a>
                  </Link>
                </div>
                {user?.me ? (
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
                                user?.me?.avatar?.Location ||
                                getAvatar(user?.me?.username)
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
                            {userNavs.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link href={item.href}>
                                    <a
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                            <Menu.Item>
                              <button
                                onClick={userLogout}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                              >
                                로그아웃
                              </button>
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
                )}
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
