import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { routes } from "../../src/routes";
import { ACCESS_TOKEN } from "../../src/utils/auth.utils";
import { deleteUser } from "../../src/__generated__/deleteUser";
import FormError from "../auth/FormError";

const DELETE_USER = gql`
  mutation deleteUser {
    deleteUser {
      ok
      error
    }
  }
`;

export default function DeleteUserForm() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState } = useForm();
  const [deleteError, setDeleteError] = useState("");

  const onDeleteUser = (data: deleteUser) => {
    if (data.deleteUser?.ok) {
      localStorage.removeItem(ACCESS_TOKEN);
      router.push(routes.logout);
      alert("회원 탈퇴 완료");
    } else {
      setDeleteError(data.deleteUser.error || "");
    }
  };

  const [deleteUserMutation, { loading }] = useMutation<deleteUser>(
    DELETE_USER,
    {
      onCompleted: onDeleteUser,
    }
  );

  const onValid = () => {
    deleteUserMutation();
  };

  return (
    <section aria-labelledby="user-profile-heading">
      <form onSubmit={handleSubmit(onValid)}>
        <div
          className="overflow-hidden rounded-3xl"
          style={{ boxShadow: "0 1px 20px 0 rgb(0 0 0 / 10%)" }}
        >
          <div className="px-4 py-6 bg-white sm:p-6">
            <div>
              <h2
                id="user-profile-heading"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                회원 탈퇴
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                회원을 탈퇴해도 기존의 게시물은 삭제 되지 않습니다. 삭제할
                게시물이 있다면 삭제후 탈퇴하세요. 한 번 탈퇴하면 복구 할 수
                없습니다.
              </p>
            </div>
          </div>
          <div className="px-4 bg-white sm:p-6">
            <span className="text-sm font-medium text-gray-700">
              회원을 탈퇴하려면 다음 문구를 정확하게 입력하세요:
            </span>
            <span className="ml-3 text-sm font-bold text-gray-900">
              회원 탈퇴에 동의합니다
            </span>
            <input
              {...register("repeat", {
                required: "닉네임은 필수 항목입니다.",
                minLength: {
                  value: 2,
                  message: "닉네임은 최소 2글자 이상이어야 합니다.",
                },
                maxLength: {
                  value: 30,
                  message: "닉네임은 최대 30글자 이하이어야 합니다.",
                },
              })}
              type="text"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <FormError message={formState?.errors?.repeat?.message} />
          </div>
          <div className="flex items-center justify-end w-full px-4 py-3 space-x-4 bg-gray-50 sm:px-6">
            <FormError message={deleteError} />
            <button
              type="submit"
              className={`${
                watch("repeat") !== "회원 탈퇴에 동의합니다" || loading
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-red-700"
              }inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              disabled={watch("repeat") !== "회원 탈퇴에 동의합니다"}
            >
              {loading ? "삭제 중" : "삭제"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
