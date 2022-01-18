import { gql, useMutation } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import { apolloClient } from "../../src/apolloClient";
import { changeUserRole } from "../../src/__generated__/changeUserRole";
import { searchUsers_searchUsers_users } from "../../src/__generated__/searchUsers";

const CHANGE_USER_ROLE_MUTATION = gql`
  mutation changeUserRole($id: Int!, $role: String!) {
    changeUserRole(id: $id, role: $role) {
      ok
      error
    }
  }
`;

interface IuserRoleChangeButton {
  user: searchUsers_searchUsers_users;
  fontSize?: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function UserRoleChangeButton({
  user,
  fontSize,
  setOpen,
}: IuserRoleChangeButton) {
  const onCompleted = (data: changeUserRole) => {
    apolloClient.cache.modify({
      id: `User:{"id":${user.id}}`,
      fields: {
        role(prev) {
          return prev === "admin" ? "user" : "admin";
        },
      },
    });
    if (setOpen) {
      setOpen(false);
    }
  };

  const [changeUserRoleMutation] = useMutation<changeUserRole>(
    CHANGE_USER_ROLE_MUTATION,
    {
      variables: {
        id: user.id,
        role: user.role === "admin" ? "user" : "admin",
      },
      onCompleted,
    }
  );

  const onClick = () => {
    if (process.browser) {
      if (
        window.confirm(
          `유저 권한을 ${
            user.role === "admin" ? "user" : "admin"
          }으로 변경 하겠습니까?`
        )
      ) {
        changeUserRoleMutation();
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${
        fontSize ? fontSize : "text-sm"
      } block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 whitespace-nowrap`}
    >
      권한 변경
    </button>
  );
}
