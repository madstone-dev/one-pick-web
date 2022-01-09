import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import FormError from "../components/auth/FormError";
import { routes } from "../src/routes";
import { DEFAULT_ERROR_MESSAGE } from "../src/constances";
import Success from "../components/notifications/Success";
import Link from "next/link";
import { ACCESS_TOKEN, getRefreshToken } from "../src/utils/auth.utils";
import Layout from "../components/auth/Layout";
import { useRouter } from "next/router";
import {
  successNotificationVar,
  SUCCESS_DEFAULT,
} from "../src/utils/notifications.utils";
import ContentSection from "../components/ContentSection";

export default function ForgotPassword() {
  const successNotification = successNotificationVar();
  const [formError, setFormError] = useState(DEFAULT_ERROR_MESSAGE);
  const { register, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  const loading = false;

  const onSubmitValid = (data: any) => {};

  const clearFormError = () => {
    setFormError(DEFAULT_ERROR_MESSAGE);
  };

  useEffect(() => {
    return () => {
      successNotificationVar(SUCCESS_DEFAULT);
    };
  }, [successNotification]);

  return (
    <Layout>
      <ContentSection>
        <div className="flex flex-col justify-center w-full min-h-full pb-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
              비밀번호 찾기
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
              <div className="mb-4 text-sm text-gray-600">
                이메일 주소를 입력하세요. 새 비밀번호를 선택할 수 있는 비밀번호
                재설정 링크를 이메일로 보내드리겠습니다.
              </div>
              <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmitValid)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    이메일
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("email", {
                        required: "이메일은 필수 항목입니다.",
                      })}
                      onKeyDown={clearFormError}
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      required
                      className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {formError.message && (
                  <div className="flex justify-center w-full">
                    <FormError message={formError.message} />
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      !formState.isValid || loading
                        ? "opacity-50 pointer-events-none"
                        : null
                    }`}
                    disabled={!formState.isValid || loading}
                  >
                    {loading
                      ? "잠시만 기다려주세요..."
                      : "비밀번호 초기화 링크 전송"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {successNotification.title && successNotification.description ? (
            <Success {...successNotification} />
          ) : null}
        </div>
      </ContentSection>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const token = getRefreshToken({ req, res });
  if (token) {
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
