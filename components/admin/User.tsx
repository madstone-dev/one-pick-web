import moment from "moment";
import "moment/locale/ko";
import Link from "next/link";
import { getAvatar } from "../../src/utils/auth.utils";
import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";

interface Iuser {
  user: searchUsers_searchUsers_users;
}

export default function User({ user }: Iuser) {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              className="w-10 h-10 rounded-full"
              src={user.avatar?.Location || getAvatar(user.username)}
              alt={`${user.username}의 프로필`}
            />
          </div>
          <div className="flex-1 ml-4">
            <div className="text-sm font-medium text-gray-900 break-all">
              {user.username}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>

            <div className="mt-2 md:hidden">
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {user.lastLogin
                  ? moment(Number(user?.lastLogin)).fromNow()
                  : "미접속"}
              </div>
            </div>

            <div className="flex items-end justify-between mt-3 md:hidden">
              <span
                className={`${
                  user.role === "user"
                    ? "text-green-800 bg-green-100"
                    : "text-indigo-800 bg-indigo-100"
                } inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full`}
              >
                {user.role}
              </span>
              <div className="text-sm font-medium whitespace-nowrap">
                <Link href={`/users/${user.id}`}>
                  <a className="text-indigo-600 hover:text-indigo-900">보기</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:table-cell">
        {user.lastLogin ? moment(Number(user?.lastLogin)).fromNow() : "미접속"}
      </td>
      <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:table-cell">
        <span
          className={`${
            user.role === "user"
              ? "text-green-800 bg-green-100"
              : "text-indigo-800 bg-indigo-100"
          } inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full`}
        >
          {user.role}
        </span>
      </td>
      <td className="hidden px-6 py-4 text-sm font-medium text-right whitespace-nowrap md:table-cell">
        <Link href={`/users/${user.id}`}>
          <a className="text-indigo-600 hover:text-indigo-900">보기</a>
        </Link>
      </td>
    </tr>
  );
}
