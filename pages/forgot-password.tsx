import { useForm } from "react-hook-form";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useState } from "react";
import FormError from "../components/auth/FormError";
import Success from "../components/notifications/Success";
import Layout from "../components/auth/Layout";
import {
  showSuccess,
  successNotificationVar,
} from "../src/utils/notifications.utils";
import ContentSection from "../components/ContentSection";
import {
  forgotPassword,
  forgotPasswordVariables,
} from "../src/__generated__/forgotPassword";
import { NextSeo } from "next-seo";
import PublicOnly from "../components/auth/PublicOnly";

const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
      error
    }
  }
`;

interface IforgotPassword {
  email: string;
}

export default function ForgotPassword() {
  const successNotification = useReactiveVar(successNotificationVar);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, formState } = useForm<IforgotPassword>({
    mode: "onChange",
  });

  const onCompleted = (data: forgotPassword) => {
    if (data?.forgotPassword?.ok) {
      showSuccess({
        title: "메일발송 완료!",
        description: "메일이 발송되었습니다. 메일을 확인 하세요!",
      });
    } else {
      setFormError(data?.forgotPassword?.error || "");
    }
  };

  const [forgotPasswordMutation, { loading }] = useMutation<forgotPassword>(
    FORGOT_PASSWORD_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmitValid = (data: forgotPasswordVariables) => {
    forgotPasswordMutation({
      variables: {
        email: data.email,
      },
    });
  };

  const clearFormError = () => {
    setFormError("");
  };

  return (
    <Layout>
      <NextSeo title="비밀번호 찾기" />
      <PublicOnly>
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
                  이메일 주소를 입력하세요. 새 비밀번호를 선택할 수 있는
                  비밀번호 재설정 링크를 이메일로 보내드리겠습니다. 메일이
                  도착하지 않는다면 스팸함을 확인해주세요.
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

                  {formError && (
                    <div className="flex justify-center w-full">
                      <FormError message={formError} />
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
      </PublicOnly>
    </Layout>
  );
}
