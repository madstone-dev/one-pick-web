import moment from "moment";
import "moment/locale/ko";
import Link from "next/link";
import { routes } from "../../src/routes";
import { getAvatar } from "../../src/utils/auth.utils";
import { showQuestions_showQuestions } from "../../src/__generated__/showQuestions";

interface IquestionInfo {
  question: showQuestions_showQuestions;
}

export default function QuestionInfo({ question }: IquestionInfo) {
  const createdAt = moment(
    moment.unix(Number(question.createdAt) / 1000)
  ).fromNow();
  const hashtags = question.hashtagString?.split(" ") || [];

  return (
    <div className="flow-root">
      <div className="-my-12 divide-y divide-gray-200">
        <div className="py-12">
          <div className="flex items-center">
            {question.user ? (
              <>
                <Link href={`/users/${question.user.id}`}>
                  <a>
                    <img
                      src={
                        question.user.avatar?.Location ||
                        getAvatar(question.user.username)
                      }
                      alt={`${question.user.username}의 프로필`}
                      className="object-cover object-center w-12 h-12 rounded-full"
                    />
                  </a>
                </Link>
                <div className="ml-4">
                  <Link href={`/users/${question.user.id}`}>
                    <a>
                      <h4 className="text-sm font-bold text-gray-900">
                        {question.user.username}
                      </h4>
                    </a>
                  </Link>
                  <div className="flex items-center mt-1 text-xs">
                    {createdAt}
                  </div>
                </div>
              </>
            ) : (
              <>
                <img
                  src={getAvatar("UN")}
                  alt="탈퇴한 유저"
                  className="object-cover object-center w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-sm italic font-semibold text-gray-900">
                    탈퇴한 유저입니다
                  </h4>
                  <div className="flex items-center mt-1 text-xs">
                    {createdAt}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 space-y-6 text-base text-gray-600">
            {question.content}
          </div>
          <div className="mt-6 space-x-2 space-y-6 text-sm text-gray-600">
            {hashtags.map((tag: string, index: number) => (
              <Link
                key={index}
                href={`${routes.search}?tag=${encodeURI(tag.slice(1))}`}
              >
                <a className="hover:text-indigo-600">{tag}</a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
