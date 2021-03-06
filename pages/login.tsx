import { useForm } from "react-hook-form";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import FormError from "../components/auth/FormError";
import { routes } from "../src/routes";
import Success from "../components/notifications/Success";
import Link from "next/link";
import {
  ACCESS_TOKEN,
  DEFAULT_ERROR_MESSAGE,
  loginUserVar,
} from "../src/utils/auth.utils";
import PublicOnly from "../components/auth/PublicOnly";
import Layout from "../components/auth/Layout";
import { useRouter } from "next/router";
import { successNotificationVar } from "../src/utils/notifications.utils";
import ContentSection from "../components/ContentSection";
import { login, loginVariables } from "../src/__generated__/login";
import { apolloClient } from "../src/apolloClient";
import { NextSeo } from "next-seo";
import { shouldRefetchQuestionsVar } from "../src/utils/questions.utils";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      error
      accessToken
    }
  }
`;

export default function Login() {
  const loginUser = loginUserVar();
  const successNotification = useReactiveVar(successNotificationVar);
  const router = useRouter();
  const [loginError, setLoginError] = useState(DEFAULT_ERROR_MESSAGE);
  const { register, handleSubmit, formState } = useForm<loginVariables>({
    mode: "onChange",
  });

  useEffect(() => {
    if (loginUser) {
      router.replace(routes.home);
    }
  }, [loginUser]);

  const onSubmitValid = (data: loginVariables) => {
    if (loading) {
      return;
    }
    apolloClient.cache.evict({
      fieldName: "me",
    });
    apolloClient.cache.gc();
    loginMutation({
      variables: { ...data },
    });
  };
  const onCompleted = (data: login) => {
    const { login } = data;
    if (login?.ok) {
      login?.accessToken && userLogin(login.accessToken);
    } else {
      setLoginError({
        message: login?.error || "",
      });
    }
  };
  const [loginMutation, { loading }] = useMutation<login>(LOGIN_MUTATION, {
    onCompleted,
  });
  const clearLoginError = () => {
    setLoginError(DEFAULT_ERROR_MESSAGE);
  };
  const userLogin = (token: string) => {
    shouldRefetchQuestionsVar(true);
    localStorage.setItem(ACCESS_TOKEN, token);
    router.push(routes.home);
  };

  return (
    <Layout>
      <NextSeo title="?????????" />
      <PublicOnly>
        <ContentSection>
          <div className="flex flex-col justify-center w-full min-h-full py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                ?????????
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmitValid)}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ?????????
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("email", {
                          required: "???????????? ?????? ???????????????.",
                        })}
                        onKeyDown={clearLoginError}
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        required
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ????????????
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("password", {
                          required: "??????????????? ?????? ???????????????.",
                        })}
                        onKeyDown={clearLoginError}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm">
                      <Link href={routes.forgotPassword}>
                        <a className="font-medium text-indigo-600 hover:text-indigo-500">
                          ???????????? ??????
                        </a>
                      </Link>
                    </div>
                  </div>

                  {loginError.message && (
                    <div className="flex justify-center w-full">
                      <FormError message={loginError.message} />
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
                      {loading ? "????????? ???..." : "?????????"}
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 text-gray-500 bg-white">
                        ?????? ????????? ??????????
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Link href={routes.register}>
                      <a className="font-medium text-indigo-600 hover:text-indigo-500">
                        ?????? ?????????
                      </a>
                    </Link>
                  </div>
                </div>
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
