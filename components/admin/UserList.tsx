import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";
import User from "./User";

interface IuserList {
  users: searchUsers_searchUsers_users[] | null;
}

export default function UserList({ users }: IuserList) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block w-full max-w-full min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    사용자
                  </th>
                  <th
                    scope="col"
                    className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell"
                  >
                    최근 접속일
                  </th>
                  <th
                    scope="col"
                    className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell"
                  >
                    권한
                  </th>
                  <th
                    scope="col"
                    className="relative hidden px-6 py-3 md:table-cell"
                  >
                    <span className="sr-only">보기</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.map((user, index) => (
                  <User user={user} key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
