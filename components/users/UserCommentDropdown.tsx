import { Menu } from "@headlessui/react";
import { focusedCommentVar } from "../../src/utils/questionComments.utils";
import { loginUserVar } from "../../src/utils/auth.utils";
import { myQuestionComments_me_questionComments } from "../../src/__generated__/myQuestionComments";
import Link from "next/link";
import UserCommentDeleteButton from "./UserCommentDeleteButton";
import UserCommentBlockButton from "./UserCommentBlockButton";
import DropdownMenu from "../DropdownMenu";

interface IuserCommentDropdown {
  comment: myQuestionComments_me_questionComments;
}

export default function UserCommentDropdown({ comment }: IuserCommentDropdown) {
  const loginUser = loginUserVar();

  const afterEnter = () => {
    focusedCommentVar(comment.id);
  };
  const afterLeave = () => {
    focusedCommentVar(null);
  };

  return (
    <DropdownMenu afterEnter={afterEnter} afterLeave={afterLeave}>
      <Menu.Item>
        <Link href={`/questions/${comment.question.id}`}>
          <a className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            게시물로 이동
          </a>
        </Link>
      </Menu.Item>
      {loginUser?.id === comment.user.id ? (
        <Menu.Item>
          <div>
            <UserCommentDeleteButton comment={comment} />
          </div>
        </Menu.Item>
      ) : (
        <Menu.Item>
          <div>
            <UserCommentBlockButton comment={comment} />
          </div>
        </Menu.Item>
      )}
    </DropdownMenu>
  );
}
