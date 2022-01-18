import { useState } from "react";
import Link from "next/link";
import { myQuestionComments_me_questionComments } from "../../src/__generated__/myQuestionComments";
import { loginUserVar } from "../../src/utils/auth.utils";
import UserCommentDeleteButton from "./UserCommentDeleteButton";
import UserCommentBlockButton from "./UserCommentBlockButton";
import MobileMenu from "../MobileMenu";

interface IuserCommentMobileMenu {
  comment: myQuestionComments_me_questionComments;
}

export default function UserCommentMobileMenu({
  comment,
}: IuserCommentMobileMenu) {
  const [open, setOpen] = useState(false);
  const loginUser = loginUserVar();

  return (
    <MobileMenu title="내 댓글 메뉴" open={open} setOpen={setOpen}>
      <li className="w-full">
        <Link href={`/questions/${comment.question.id}`}>
          <a className="block w-full px-4 py-2 text-base font-medium text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap">
            게시물로 이동
          </a>
        </Link>
      </li>
      {loginUser?.id === comment.user.id ? (
        <li className="w-full">
          <UserCommentDeleteButton
            comment={comment}
            fontSize="text-base font-medium"
            setOpen={setOpen}
          />
        </li>
      ) : (
        <li className="w-full">
          <UserCommentBlockButton
            comment={comment}
            fontSize="text-base font-medium"
            setOpen={setOpen}
          />
        </li>
      )}
    </MobileMenu>
  );
}
