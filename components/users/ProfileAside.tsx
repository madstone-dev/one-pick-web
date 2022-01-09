import { UserCircleIcon, ChatIcon, BanIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { routes } from "../../src/routes";
import { classNames } from "../../src/utils/utils";

const subNavigation = [
  { name: "프로필 설정", href: routes.userProfile, icon: UserCircleIcon },
  { name: "작성한 댓글", href: routes.userComments, icon: ChatIcon },
  { name: "숨긴 콘텐츠", href: routes.userBlocks, icon: BanIcon },
];

export default function ProfileAside() {
  const router = useRouter();

  return (
    <aside className="px-2 py-6 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {subNavigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <a
              className={classNames(
                router.pathname === item.href
                  ? "bg-gray-50 text-indigo-600 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              )}
              aria-current={router.pathname === item.href ? "page" : undefined}
            >
              <item.icon
                className={classNames(
                  router.pathname === item.href
                    ? "text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
