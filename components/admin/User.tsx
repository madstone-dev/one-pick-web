import moment from "moment";
import "moment/locale/ko";
import { getAvatar } from "../../src/utils/auth.utils";
import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";
import UserDropdown from "./UserDropdown";
import UserMobileMenu from "./UserMobileMenu";

interface Iuser {
  user: searchUsers_searchUsers_users;
}

export default function User({ user }: Iuser) {
  return (
    <div>
      <div className="flex items-start px-4 py-4 sm:px-6">
        <div className="flex items-start flex-1 min-w-0">
          <div className="flex-shrink-0">
            <img
              src={user.avatar?.Location || getAvatar(user.username)}
              alt={`${user.username}의 프로필`}
              className="object-cover object-center w-12 h-12 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
            <div>
              <div>
                <span
                  className={`${
                    user.role === "user"
                      ? "text-green-800 bg-green-100"
                      : "text-indigo-800 bg-indigo-100"
                  } inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full`}
                >
                  {user.role}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">
                {user.username}
              </p>
              <p className="flex items-center mt-2 text-sm text-gray-500">
                {user.email}
              </p>
            </div>
            <div className="hidden md:block">
              <div>
                <p className="flex items-center mt-2 text-sm text-gray-500">
                  {user.lastLogin
                    ? moment(Number(user?.lastLogin)).fromNow()
                    : "미접속"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <UserDropdown user={user} />
        </div>
        <div className="block lg:hidden">
          <UserMobileMenu user={user} />
        </div>
      </div>
    </div>
  );
}
