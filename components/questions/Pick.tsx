import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { apolloClient } from "../../src/apolloClient";

const PICK_MUTATION = gql`
  mutation Pick($id: Int!, $pick: Int!) {
    pick(id: $id, pick: $pick) {
      ok
      error
    }
  }
`;

export default function Pick({ question }: any) {
  const id = question.id;
  const [pickMutation] = useMutation(PICK_MUTATION);
  const onPickClick = (pick: number) => {
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
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4">
      <div
        className={`p-4 rounded-md cursor-pointer ${
          question?.myPick === 1
            ? "bg-indigo-200"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
        onClick={() => {
          onPickClick(1);
        }}
      >
        <span className="block text-sm font-medium text-gray-700">선택 1</span>
        <div className="mt-1 text-lg font-semibold">{question?.choice[0]}</div>
      </div>

      <div
        className={`p-4 rounded-md cursor-pointer ${
          question?.myPick === 2
            ? "bg-indigo-200"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
        onClick={() => {
          onPickClick(2);
        }}
      >
        <span className="block text-sm font-medium text-gray-700">선택 2</span>
        <div className="mt-1 text-lg font-semibold">{question?.choice[1]}</div>
      </div>
    </div>
  );
}
