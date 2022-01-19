import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { routes } from "../../src/routes";
import { loginUserVar } from "../../src/utils/auth.utils";
import { showUser_showUser } from "../../src/__generated__/showUser";
import ToggleFollowButton from "./ToggleFollowButton";
import UserFollowers from "./UserFollowers";
import UserFollowings from "./UserFollowings";

interface IuserInfo {
  user: showUser_showUser;
  userProfileImage: string;
}

export default function UserInfo({ user, userProfileImage }: IuserInfo) {
  const router = useRouter();
  const loginUser = useReactiveVar(loginUserVar);
  const id = parseInt(router.query.id as string);

  return (
    <div className="w-full max-w-4xl px-4 pt-8 pb-2 mx-auto h-fit">
      <div className="flex flex-col flex-wrap items-center justify-center w-full space-y-6">
        <div className="flex-shrink-0">
          <div className="relative mx-6">
            <img
              className="object-cover object-center rounded-full w-28 h-28 md:w-40 md:h-40"
              src={userProfileImage}
              alt={user?.username}
            />
            <span
              className="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="mx-auto text-2xl font-bold text-gray-900 break-all w-fit">
            {user?.username}
          </h1>
          <div className="flex justify-between space-x-8 text-base font-medium text-gray-500 md:space-x-16">
            <div className="flex flex-col items-center justify-center">
              <span>{user?.totalQuestions}</span>
              <span className="whitespace-nowrap">게시물</span>
            </div>
            <UserFollowers user={user} />
            <UserFollowings user={user} />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse w-full max-w-sm mx-auto mt-6 space-y-4 h-fit">
        {loginUser && id === loginUser?.id ? (
          <Link href={routes.userProfile}>
            <a className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              계정 설정
            </a>
          </Link>
        ) : (
          <ToggleFollowButton user={user} />
        )}
      </div>
    </div>
  );
}
