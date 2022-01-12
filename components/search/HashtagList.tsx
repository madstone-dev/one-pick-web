import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { searchQuestionHashtags_searchQuestionHashtags } from "../../src/__generated__/searchQuestionHashtags";

interface IhashtagList {
  hashtags: searchQuestionHashtags_searchQuestionHashtags[];
  onSearch: Function;
  inputFocused: boolean;
  keyword: string;
}

export default function HashtagList({
  hashtags,
  onSearch,
  inputFocused,
  keyword,
}: IhashtagList) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={inputFocused}
    >
      <div className="border-t border-gray-100">
        <div className="absolute w-full h-screen bg-gray-600 bg-opacity-30"></div>
        <div className="absolute z-10 w-full px-2 transform -translate-x-1/2 left-1/2 sm:px-0 md:max-w-3xl">
          <div className="overflow-hidden rounded-b-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative grid gap-6 px-5 py-6 overflow-y-auto bg-white sm:gap-8 sm:p-8 max-h-96">
              {hashtags.length > 0 ? (
                hashtags.map((item, index) => (
                  <button
                    key={index}
                    className="block w-full p-3 text-left transition duration-150 ease-in-out rounded-md hover:bg-gray-50"
                    onClick={() => {
                      onSearch("hashtag", item.hashtag);
                    }}
                  >
                    <p className="text-base font-medium text-gray-900">
                      #{item.hashtag}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      게시물 {item.totalQuestions}
                    </p>
                  </button>
                ))
              ) : (
                <button
                  className="block w-full p-3 text-left transition duration-150 ease-in-out rounded-md hover:bg-gray-50"
                  onClick={() => {
                    onSearch("text", keyword);
                  }}
                >
                  {!keyword.trim()
                    ? "한 글자 이상 입력해주세요"
                    : `'${keyword}' 를 포함한 게시물을 찾습니다`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
