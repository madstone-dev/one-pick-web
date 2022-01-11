import {
  LightningBoltIcon,
  UsersIcon,
  FlagIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { routes } from "../../src/routes";
import { classNames } from "../../src/utils/utils";

const subNavigation = [
  { name: "대시 보드", href: routes.adminMenu, icon: LightningBoltIcon },
  { name: "유저 목록", href: routes.adminUserList, icon: UsersIcon },
  { name: "신고 목록", href: routes.adminReport, icon: FlagIcon },
];

export default function AdminAside() {
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
