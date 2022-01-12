import { PlusSmIcon, SearchIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { routes } from "../src/routes";
import { actionButtonShadow } from "../src/utils/utils";
import { me } from "../src/__generated__/me";

interface IactionBar {
  user: me | undefined;
}

export default function ActionBar({ user }: IactionBar) {
  return (
    <footer className="fixed z-30 bottom-8 right-4">
      <div className="flex flex-col space-y-4">
        {user && (
          <Link href={routes.createQuestion}>
            <a
              className="block p-3 font-bold bg-white border rounded-full border-gray-50"
              style={{ boxShadow: actionButtonShadow }}
            >
              <PlusSmIcon
                className="w-6 h-6 sm:w-8 sm:h-8"
                aria-hidden="true"
              />
            </a>
          </Link>
        )}
        <Link href={routes.search}>
          <a
            className="block p-3 font-bold bg-white border rounded-full border-gray-50"
            style={{ boxShadow: actionButtonShadow }}
          >
            <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
          </a>
        </Link>
      </div>
    </footer>
  );
}
