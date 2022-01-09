import { gql, useMutation } from "@apollo/client";
import { apolloClient } from "../../src/apolloClient";
import { CheckIcon } from "@heroicons/react/outline";
import { toggleFollowUser } from "../../src/__generated__/toggleFollowUser";
import { showUser_showUser } from "../../src/__generated__/showUser";

const TOGGLE_FOLLOW_USER = gql`
  mutation toggleFollowUser($id: Int!) {
    toggleFollowUser(id: $id) {
      ok
      error
    }
  }
`;

interface ItoggleFollowButton {
  user: showUser_showUser;
}

export default function ToggleFollowButton({ user }: ItoggleFollowButton) {
  const onCompleted = () => {
    apolloClient.cache.modify({
      id: `User:{"id":${user?.id}}`,
      fields: {
        isFollowing(prev) {
          return !prev;
        },
      },
    });
  };

  const [toggleFollowUserMutation] = useMutation<toggleFollowUser>(
    TOGGLE_FOLLOW_USER,
    {
      variables: {
        id: user?.id,
      },
      onCompleted,
    }
  );

  const onClick = () => {
    if (user) {
      toggleFollowUserMutation();
    }
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={`${
        user?.isFollowing
          ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-offset-gray-100 focus:ring-indigo-500"
          : "text-white bg-indigo-600 border border-transparent hover:bg-indigo-700 focus:ring-offset-gray-100 focus:ring-indigo-500"
      } inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
    >
      {user?.isFollowing && (
        <CheckIcon className="w-4 h-4 mr-2 text-gray-700" aria-hidden="true" />
      )}
      {user?.isFollowing ? "팔로잉" : "팔로우"}
    </button>
  );
}
