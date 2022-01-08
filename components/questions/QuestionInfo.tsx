import moment from "moment";
import "moment/locale/ko";
import Link from "next/link";
import { getAvatar } from "../../src/utils/auth.utils";

export default function QuestionInfo({ question }: any) {
  const createdAt = moment(moment.unix(question.createdAt / 1000)).fromNow();
  const hashtags =
    question.questionHashtags?.map((item: any) => item.hashtag) || [];

  return (
    <div className="flow-root">
      <div className="-my-12 divide-y divide-gray-200">
        <div className="py-12">
          <div className="flex items-center">
            <Link href={`/users/${question.user.id}`}>
              <a>
                <img
                  src={
                    question.user.avatar || getAvatar(question.user.username)
                  }
                  alt={`${question.user.username}의 프로필`}
                  className="w-12 h-12 rounded-full"
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
              <div className="flex items-center mt-1 text-xs">{createdAt}</div>
            </div>
          </div>

          <div className="px-1 mt-4 space-y-6 text-base text-gray-600">
            {question.content}
          </div>
          <div className="mt-6 space-x-2 space-y-6 text-sm text-gray-600">
            {hashtags.map((tag: string, index: number) => (
              <span key={index} className="hover:text-indigo-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
