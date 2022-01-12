import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";
import User from "./User";

interface IuserList {
  users: searchUsers_searchUsers_users[] | null;
}

export default function UserList({ users }: IuserList) {
  return (
    <div className="pb-20 bg-white sm:rounded-md sm:px-2">
      <ul
        role="list"
        className="border border-gray-100 divide-y divide-gray-200 shadow-md sm:rounded-md"
      >
        {/* list header */}
        <li className="sm:rounded-md">
          <div className="flex items-start px-6 py-3 bg-gray-50">
            <div className="flex-1 min-w-0 md:grid md:grid-cols-2 md:gap-6">
              <div>
                <p className="text-xs text-gray-500">닉네임 / 이메일</p>
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-gray-500">최근 접속시간</p>
              </div>
            </div>
            <div className="sr-only">메뉴</div>
          </div>
        </li>
        {users?.map((user, index) => (
          <User
            user={user}
            key={index}
            isLast={index > 1 && users?.length === index + 1}
          />
        ))}
      </ul>
    </div>
  );
}
