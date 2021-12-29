import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { PlusSmIcon } from "@heroicons/react/solid";
import { routes } from "../src/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import useUser from "../src/hooks/useUser";
import { ACCESS_TOKEN } from "../src/utils/auth.utils";
import Link from "next/link";
import { useRouter } from "next/router";

const headerNavs = [{ name: "홈", href: routes.home, current: true }];
const userNavs = [{ name: "내 정보", href: "#" }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function HeaderNav() {
  const router = useRouter();
  const { data, loading } = useUser();
  const userLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    router.push("/logout");
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-10 bg-gray-800">
      {({ open }) => (
        <>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center mr-2 -ml-2 md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <Disclosure.Button>
                  <Link href={routes.home}>
                    <a className="items-center flex-shrink-0 hidden text-white md:flex">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="relative mr-3 text-2xl"
                      />
                      <span className="text-xl font-semibold">One Pick !</span>
                    </a>
                  </Link>
                </Disclosure.Button>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {headerNavs.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                    >
                      <a
                        className={classNames(
                          item.current
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
                  <a className="text-xl font-semibold text-white">One Pick !</a>
                </Link>
              </div>
              {data?.me ? (
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href={routes.createQuestion}>
                      <a className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                        <PlusSmIcon
                          className="w-4 h-4 mr-1 -ml-1"
                          aria-hidden="true"
                        />
                        <span>만들기</span>
                      </a>
                    </Link>
                  </div>
                  <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>

                          <img
                            className="object-cover rounded-full w-9 h-9"
                            src={
                              data?.me?.avatar ||
                              encodeURI(
                                `https://ui-avatars.com/api/?name=${data?.me?.username}&color=7F9CF5&background=EBF4FF`
                              )
                            }
                            alt={`${data?.me?.username}'s profile`}
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
                        <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavs.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link href={item.href}>
                                  <a
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
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
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
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

          {/* mobile nav */}
          <Disclosure.Panel className="md:hidden">
            {headerNavs.length > 0 && (
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {headerNavs.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            )}
            {data?.me ? (
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="object-cover rounded-full w-9 h-9"
                      src={
                        data?.me?.avatar ||
                        encodeURI(
                          `https://ui-avatars.com/api/?name=${data?.me?.username}&color=7F9CF5&background=EBF4FF`
                        )
                      }
                      alt={`${data?.me?.username}'s profile`}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {data?.me?.username}
                    </div>
                  </div>
                </div>
                <div className="px-2 mt-3 space-y-1 sm:px-3">
                  {userNavs.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  <button
                    onClick={userLogout}
                    className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : null}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
