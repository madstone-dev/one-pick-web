import { useEffect, useRef } from "react";
import { routes } from "../src/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { headerHeightVar, loadingUserVar } from "../src/utils/auth.utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { me } from "../src/__generated__/me";
import { shouldRefetchQuestionsVar } from "../src/utils/questions.utils";
import HeaderUserNav from "./HeaderUserNav";
import { useReactiveVar } from "@apollo/client";

interface IheaderNav {
  user: me | undefined;
}

export default function HeaderNav({ user }: IheaderNav) {
  const headerRef = useRef<any>();
  const router = useRouter();
  const loading = useReactiveVar(loadingUserVar);

  const onBackClick = () => {
    router.back();
  };

  const headerNavs = [{ name: "홈", href: routes.home }];

  useEffect(() => {
    headerHeightVar(headerRef.current.clientHeight);
  }, []);

  return (
    <div ref={headerRef} className="sticky top-0 z-40">
      <nav className="bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {router.pathname !== routes.home ? (
                <div
                  className="p-2 rounded-full cursor-pointer"
                  onClick={onBackClick}
                >
                  <ChevronLeftIcon
                    className="w-6 h-6 text-white sm:w-8 sm:h-8 md:hidden"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <div className="p-2 rounded-full pointer-events-none">
                  <ChevronLeftIcon
                    className="w-6 h-6 text-white opacity-0 pointer-events-none sm:w-8 sm:h-8 sm:hidden"
                    aria-hidden="true"
                  />
                </div>
              )}
              <Link href={routes.home}>
                <a
                  className="items-center flex-shrink-0 hidden text-white md:flex"
                  onClick={() => {
                    shouldRefetchQuestionsVar(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="relative w-6 h-6 mr-3 text-2xl"
                  />
                  <span className="text-xl font-semibold whitespace-nowrap">
                    One Pick !
                  </span>
                </a>
              </Link>
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
                      className={`
                        ${
                          item.href === router.pathname
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }
                        px-3 py-2 rounded-md text-sm font-medium`}
                      onClick={
                        item.href === routes.home
                          ? () => {
                              shouldRefetchQuestionsVar(true);
                            }
                          : undefined
                      }
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center md:hidden">
              <Link href={routes.home}>
                <a
                  className="flex items-center flex-shrink-0 text-white"
                  onClick={() => {
                    shouldRefetchQuestionsVar(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="relative w-6 h-6 mr-3 text-2xl"
                  />
                  <span className="text-xl font-semibold whitespace-nowrap">
                    One Pick !
                  </span>
                </a>
              </Link>
            </div>
            {loading ? (
              <div className="flex items-center">
                <div className="flex items-center flex-shrink-0">
                  <div className="relative ml-3">
                    <div className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <div className="object-cover rounded-full w-9 h-9 bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <HeaderUserNav user={user} />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
