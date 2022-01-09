import Layout from "../../components/auth/Layout";
import {
  getAvatar,
  getRefreshToken,
  loginUserVar,
} from "../../src/utils/auth.utils";
import { routes } from "../../src/routes";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ProfileAside from "../../components/users/ProfileAside";
import useUser from "../../src/hooks/useUser";
import FormError from "../../components/auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { BASIC_USER_FRAGMENT } from "../../src/fragments";
import { apolloClient } from "../../src/apolloClient";

const UPDATE_USER = gql`
  mutation updateUser(
    $fileExists: Boolean!
    $username: String
    $password: String
    $avatar: Upload
  ) {
    updateUser(
      fileExists: $fileExists
      username: $username
      password: $password
      avatar: $avatar
    ) {
      ok
      error
      user {
        ...BasicUserFragment
      }
    }
  }
  ${BASIC_USER_FRAGMENT}
`;

export default function UserProfile() {
  const { data: userData } = useUser();
  const { register, handleSubmit, setValue, watch, formState } = useForm();
  const [photo, setPhoto] = useState<any>();
  const [fileError, setFileError] = useState("");
  const [fileExists, setFileExists] = useState(true);
  const [updateError, setUpdateError] = useState("");

  const onUpdateUser = (data: any) => {
    if (data.updateUser?.ok) {
      apolloClient.cache.modify({
        id: `User:${userData.id}`,
        fields: {
          username() {
            return data.updateUser.username;
          },
          avatar() {
            return data.updateUser.avatar?.Location
              ? data.updateUser.avatar?.Location.Location
              : null;
          },
        },
      });
      setValue("password", "");
      alert("저장 완료");
    } else {
      setUpdateError(data.updateUser.error);
    }
  };

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: onUpdateUser,
  });

  const onFileDelete = () => {
    setFileExists(false);
    setPhoto({
      url: getAvatar(userData?.me?.username),
      file: undefined,
    });
  };

  const onFileChange = (event: any) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    if (file.size > 5242880) {
      setFileError("최대 5MB 까지 가능합니다.");
      event.target.value = "";
      return;
    }
    const photo = {
      url: URL.createObjectURL(file),
      file,
    };
    setFileExists(true);
    setPhoto(photo);
    event.target.value = "";
  };

  useEffect(() => {
    if (userData?.me) {
      setValue("username", userData?.me?.username);
      setValue("email", userData?.me?.email);
    }
  }, [userData]);

  const onValid = (data: any) => {
    const file = photo?.file;
    updateUser({
      variables: {
        username:
          userData?.me?.username !== watch("username")
            ? data.username
            : undefined,
        password: data.password,
        avatar: file || undefined,
        fileExists,
      },
    });
  };

  return (
    <Layout>
      <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <ProfileAside />

          {/* 프로필 설정 */}
          <div className="px-4 space-y-6 sm:px-6 lg:px-8 lg:col-span-9">
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
                        프로필 설정
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        프로질 사진, 닉네임 및 비밀번호를 변경 할 수 있습니다.
                      </p>
                    </div>

                    <div className="mt-6">
                      <span className="block text-sm font-medium text-gray-700">
                        사진
                      </span>
                      <div className="flex items-center mt-1">
                        <img
                          className="inline-block w-12 h-12 rounded-full"
                          src={
                            photo
                              ? photo.url
                              : userData?.me?.avatar?.Location ||
                                getAvatar(userData?.me?.username)
                          }
                          alt=""
                        />
                        <div className="flex ml-4">
                          <div className="relative flex items-center px-3 py-2 bg-white border rounded-md shadow-sm border-blue-gray-300 hover:bg-blue-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 focus-within:ring-blue-500">
                            <label
                              htmlFor="user-photo"
                              className="relative text-sm font-medium cursor-pointer text-blue-gray-900"
                            >
                              <span>변경</span>
                              <span className="sr-only">프로필 사진</span>
                            </label>
                            <input
                              onChange={onFileChange}
                              id="user-photo"
                              name="user-photo"
                              type="file"
                              className="absolute inset-0 w-full h-full border-gray-300 rounded-md opacity-0 pointer-events-none"
                            />
                          </div>
                          <button
                            onClick={onFileDelete}
                            type="button"
                            className="px-3 py-2 ml-3 text-sm font-medium bg-transparent border border-transparent rounded-md text-blue-gray-900 hover:text-blue-gray-700 focus:outline-none focus:border-blue-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-gray-50 focus:ring-blue-500"
                          >
                            제거
                          </button>
                        </div>
                      </div>
                      <FormError message={fileError} />
                    </div>

                    <div className="grid grid-cols-4 gap-6 mt-6">
                      <label className="col-span-4 sm:col-span-2">
                        <span className="block text-sm font-medium text-gray-700">
                          닉네임
                        </span>
                        <input
                          {...register("username", {
                            required: "닉네임은 필수 항목입니다.",
                            minLength: {
                              value: 2,
                              message: "닉네임은 최소 2글자 이상이어야 합니다.",
                            },
                            maxLength: {
                              value: 30,
                              message:
                                "닉네임은 최대 30글자 이하이어야 합니다.",
                            },
                          })}
                          type="text"
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <FormError
                          message={formState?.errors?.username?.message}
                        />
                      </label>
                      <label className="col-span-4 sm:col-span-2">
                        <span className="block text-sm font-medium text-gray-700">
                          비밀번호
                        </span>
                        <input
                          {...register("password", {
                            minLength: {
                              value: 8,
                              message:
                                "비밀번호는 최소 8글자 이상이어야 합니다.",
                            },
                          })}
                          type="password"
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <FormError
                          message={formState?.errors?.password?.message}
                        />
                      </label>
                      <label className="col-span-4 sm:col-span-2">
                        <span className="block text-sm font-medium text-gray-700">
                          이메일
                        </span>
                        <input
                          {...register("email")}
                          type="text"
                          disabled
                          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm pointer-events-none sm:text-sm bg-gray-50"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-end w-full px-4 py-3 space-x-4 bg-gray-50 sm:px-6">
                    <FormError message={updateError} />
                    <button
                      type="submit"
                      className={`${
                        watch("username") === userData?.me?.username &&
                        watch("password") === "" &&
                        !photo
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      disabled={
                        watch("username") === userData?.me?.username &&
                        watch("password") === "" &&
                        !photo
                      }
                    >
                      저장
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const token = getRefreshToken({ req, res });
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: routes.home,
      },
    };
  }
  return {
    props: {},
  };
}
