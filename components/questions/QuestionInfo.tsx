import moment from "moment";
import "moment/locale/ko";

export default function QuestionInfo({ question }: any) {
  moment.locale();
  const createdAt = moment(moment.unix(question.createdAt / 1000)).fromNow();

  return (
    <div className="flow-root">
      <div className="-my-12 divide-y divide-gray-200">
        <div className="py-12">
          <div className="flex items-center">
            <img
              src={
                question.user.avatar ||
                encodeURI(
                  `https://ui-avatars.com/api/?name=${question?.user?.username}&color=7F9CF5&background=EBF4FF`
                )
              }
              alt={`${question.user.username}의 프로필`}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-4">
              <h4 className="text-sm font-bold text-gray-900">
                {question.user.username}
              </h4>
              <div className="flex items-center mt-1 text-xs">{createdAt}</div>
            </div>
          </div>

          <div className="px-1 mt-4 space-y-6 text-base text-gray-600">
            {question.content}
          </div>
        </div>
      </div>
    </div>
  );
}
