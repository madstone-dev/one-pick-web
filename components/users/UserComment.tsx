import { useReactiveVar } from "@apollo/client";
import { focusedCommentVar } from "../../src/utils/questionComments.utils";
import moment from "moment";
import { getAvatar, loginUserVar } from "../../src/utils/auth.utils";
import "moment/locale/ko";
import Link from "next/link";
import UserCommentDropdown from "./UserCommentDropdown";

export default function UserComment({ comment }: any) {
  const createdAt = moment(moment.unix(comment.createdAt / 1000)).fromNow();
  const loginUser = loginUserVar();
  const focusedComment = useReactiveVar(focusedCommentVar);

  return (
    <div className="py-6 group">
      <div className="flex items-start">
        <Link href={`/users/${comment.user.id}`}>
          <a>
            <img
              src={
                comment.user.avatar?.Location ||
                getAvatar(comment.user.username)
              }
              alt={`${comment.user.username}.`}
              className="w-10 h-10 rounded-full"
            />
          </a>
        </Link>
        <div className="flex-1 ml-4">
          <h4>
            <Link href={`/users/${comment.user.id}`}>
              <a>
                <span className="text-sm font-bold text-gray-900">
                  {comment.user.username}
                </span>
              </a>
            </Link>
            <span className="ml-3 text-xs">{createdAt}</span>
          </h4>
          <div className="mt-2 text-base text-gray-600 6">
            {comment.content}
          </div>
        </div>
        {loginUser && (
          <div
            className={
              focusedComment === comment.id
                ? "opacity-100"
                : "sm:opacity-0 group-hover:opacity-100"
            }
          >
            <UserCommentDropdown comment={comment} />
          </div>
        )}
      </div>
    </div>
  );
}