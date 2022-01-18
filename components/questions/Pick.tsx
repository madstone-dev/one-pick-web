import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { apolloClient } from "../../src/apolloClient";
import { routes } from "../../src/routes";
import { loginUserVar } from "../../src/utils/auth.utils";
import { pick } from "../../src/__generated__/pick";
import { showQuestion_showQuestion } from "../../src/__generated__/showQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const PICK_MUTATION = gql`
  mutation pick($id: Int!, $pick: Int!) {
    pick(id: $id, pick: $pick) {
      ok
      error
    }
  }
`;

interface Ipick {
  question: showQuestion_showQuestion;
}

export default function Pick({ question }: Ipick) {
  const loginUser = loginUserVar();
  const router = useRouter();
  const id = question.id;
  const totalPicks = question.userPicks.total;
  const firstPickPercent =
    question.userPicks.first === 0
      ? 0
      : Math.round((question.userPicks.first / totalPicks) * 100);
  const [pickMutation] = useMutation<pick>(PICK_MUTATION);
  const onPickClick = (pick: number) => {
    if (!loginUser) {
      router.push(routes.login);
      return;
    }

    if (pick === question.myPick) {
      return;
    }

    pickMutation({
      variables: {
        id,
        pick,
      },
    });

    apolloClient.cache.modify({
      id: `Question:${id}`,
      fields: {
        myPick() {
          return pick;
        },
        userPicks(prev, { readField }) {
          if (readField("myPick")) {
            if (readField("myPick") === 1) {
              return {
                ...prev,
                first: prev.first - 1,
                second: prev.second + 1,
              };
            } else {
              return {
                ...prev,
                first: prev.first + 1,
                second: prev.second - 1,
              };
            }
          } else {
            if (pick === 1) {
              return {
                ...prev,
                first: 1,
                total: 1,
              };
            } else {
              return {
                ...prev,
                second: 1,
                total: 1,
              };
            }
          }
        },
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-end mb-1 text-sm text-gray-400">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="relative w-3 h-3 mr-1 text-sm"
        />
        <span>{totalPicks}명 참여 중</span>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4">
        <div
          className={`${
            question.myPick ? "" : "hover:bg-gray-200"
          } relative p-4 overflow-hidden bg-gray-100 rounded-md cursor-pointer group`}
          onClick={() => {
            onPickClick(1);
          }}
        >
          {question.myPick && (
            <div
              className={`absolute w-full h-full top-0 left-0 z-0 duration-500 ${
                question?.myPick === 1
                  ? "bg-indigo-300 group-hover:bg-indigo-400"
                  : "bg-gray-300 group-hover:bg-gray-400"
              }`}
              style={{
                width: `${Number(firstPickPercent)}%`,
              }}
            />
          )}
          <div className="relative bg-transparent">
            <span className="block text-sm font-medium text-gray-700">
              선택 1
            </span>
            <div className="mt-1 text-lg font-semibold">
              {question?.choice[0]}
            </div>
            {question.myPick && (
              <span className="block mt-3 text-lg font-medium text-right text-gray-700">
                {Number(firstPickPercent)}%
              </span>
            )}
          </div>
        </div>

        <div
          className={`${
            question.myPick ? "" : "hover:bg-gray-200"
          } relative p-4 overflow-hidden bg-gray-100 rounded-md cursor-pointer group`}
          onClick={() => {
            onPickClick(2);
          }}
        >
          {question.myPick && (
            <div
              className={`absolute w-full h-full top-0 left-0 z-0 duration-500 ${
                question?.myPick === 2
                  ? "bg-indigo-300 group-hover:bg-indigo-400"
                  : "bg-gray-300 group-hover:bg-gray-400"
              }`}
              style={{
                width: `${100 - Number(firstPickPercent)}%`,
              }}
            />
          )}
          <div className="relative bg-transparent">
            <span className="block text-sm font-medium text-gray-700">
              선택 2
            </span>
            <div className="mt-1 text-lg font-semibold">
              {question?.choice[1]}
            </div>
            {question.myPick && (
              <span className="block mt-3 text-lg font-medium text-right text-gray-700">
                {100 - Number(firstPickPercent)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
