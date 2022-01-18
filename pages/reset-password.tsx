import { useForm } from "react-hook-form";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import FormError from "../components/auth/FormError";
import { routes } from "../src/routes";
import Success from "../components/notifications/Success";
import Layout from "../components/auth/Layout";
import { useRouter } from "next/router";
import {
  showSuccess,
  successNotificationVar,
} from "../src/utils/notifications.utils";
import ContentSection from "../components/ContentSection";
import { resetPassword } from "../src/__generated__/resetPassword";
import { NextSeo } from "next-seo";
import PublicOnly from "../components/auth/PublicOnly";

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($email: String!, $token: String!, $password: String!) {
    resetPassword(email: $email, token: $token, password: $password) {
      ok
      error
    }
  }
`;

interface IresetPasswordForm {
  email: string | null;
  password: string | null;
}

export default function ResetPassword() {
  const router = useRouter();
  const successNotification = useReactiveVar(successNotificationVar);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, formState, setValue } =
    useForm<IresetPasswordForm>({
      mode: "onChange",
    });

  const onCompleted = (data: resetPassword) => {
    if (data?.resetPassword?.ok) {
      showSuccess({
        title: "비밀번호 변경 완료!",
        description: "비밀번호가 변경되었습니다. 로그인 하세요!",
      });
      router.push(routes.login);
    } else {
      setFormError(data?.resetPassword?.error || "");
    }
  };

  const [resetPasswordMutation, { loading }] = useMutation<resetPassword>(
    RESET_PASSWORD_MUTATION,
    {
      onCompleted,
    }
  );

  const onSubmitValid = (data: IresetPasswordForm) => {
    const {
      query: { email, token },
    } = router;
    resetPasswordMutation({
      variables: {
        email,
        token,
        password: data.password,
      },
    });
  };

  const clearFormError = () => {
    setFormError("");
  };

  useEffect(() => {
    setValue("email", router?.query?.email as string);
  }, [setValue, router?.query?.email]);

  return (
    <Layout>
      <NextSeo title="비밀번호 재설정" />
      <PublicOnly>
        <ContentSection>
          <div className="flex flex-col justify-center w-full min-h-full pb-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                비밀번호 재설정
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                <div className="mb-4 text-sm text-gray-600">
                  비밀번호 재설정 링크입니다. 새로운 비밀번호를 입력하세요.
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
                        readOnly
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      새로운 비밀번호
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("password", {
                          required: "비밀번호는 필수 항목입니다.",
                        })}
                        onKeyDown={clearFormError}
                        id="password"
                        name="password"
                        type="password"
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
                          : ""
                      }`}
                      disabled={!formState.isValid || loading}
                    >
                      {loading ? "잠시만 기다려주세요..." : "비밀번호 변경"}
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
