import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation } from "@apollo/client";
import Layout from "../../components/auth/Layout";
import FormError from "../../components/auth/FormError";
import Link from "next/link";
import { routes } from "../../src/routes";
import { useRouter } from "next/router";
import { SHOW_QUESTIONS_FRAGMENT } from "../../src/fragments";
import { shouldRefetchQuestionsVar } from "../../src/utils/questions.utils";
import NavBack from "../../components/NavBack";
import ContentSection from "../../components/ContentSection";
import {
  createQuestion,
  createQuestionVariables,
} from "../../src/__generated__/createQuestion";
import { cardShadow } from "../../src/utils/utils";
import { NextSeo } from "next-seo";
import Compressor from "compressorjs";

const CREATE_QUESTION_MUTATION = gql`
  mutation createQuestion(
    $content: String!
    $choice: [String!]!
    $image: Upload!
    $questionHashtags: String
  ) {
    createQuestion(
      content: $content
      choice: $choice
      image: $image
      questionHashtags: $questionHashtags
    ) {
      ok
      error
      question {
        ...ShowQuestionsFragment
      }
    }
  }
  ${SHOW_QUESTIONS_FRAGMENT}
`;

interface Iphoto {
  url: string;
  file: File;
}

interface IcreateQuestion extends createQuestionVariables {
  firstPick: string;
  secondPick: string;
}

export default function CreateQuestion() {
  const cardRef = useRef<any>();
  const [cardTop, setCardTop] = useState(0);
  const router = useRouter();
  const [photo, setPhoto] = useState<Iphoto>();
  const onCreateQuestion = () => {
    shouldRefetchQuestionsVar(true);
    router.push(routes.home);
  };
  const [fileError, setFileError] = useState("");
  const imageFormRef = useRef<any>(null);

  const [createQuestionMutation, { loading }] = useMutation<createQuestion>(
    CREATE_QUESTION_MUTATION,
    {
      onCompleted: onCreateQuestion,
    }
  );
  const { register, handleSubmit, formState } = useForm<IcreateQuestion>({
    mode: "onChange",
  });

  const onSubmitValid = (data: IcreateQuestion) => {
    if (photo) {
      createQuestionMutation({
        variables: {
          content: data.content,
          choice: [data.firstPick, data.secondPick],
          image: photo.file,
          questionHashtags: data.questionHashtags,
        },
      });
    } else {
      setFileError("이미지는 필수 입니다.");
      imageFormRef.current && imageFormRef.current.focus();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const file = files && files[0];
    if (file) {
      if (file.size > 5242880) {
        setFileError("최대 5MB 까지 가능합니다.");
        event.target.value = "";
        return;
      }

      new Compressor(file, {
        quality: 0.8,
        success(result) {
          const photo = {
            url: URL.createObjectURL(result),
            file,
          };
          setPhoto(photo);
          event.target.value = "";
        },
      });
    }
  };

  const onDeleteClick = () => {
    setPhoto(undefined);
  };

  useEffect(() => {
    if (cardRef?.current?.offsetTop) {
      setCardTop(cardRef?.current?.offsetTop);
    }
  }, [cardRef, setCardTop]);

  return (
    <>
      <NextSeo title="질문 만들기" />
      <Layout>
        <ContentSection>
          <div className="w-full px-4 py-4 sm:py-6 lg:py-8 sm:px-6 lg:px-8">
            <div
              className="sticky"
              style={{
                top: cardTop,
              }}
            >
              <NavBack />
            </div>
            <div
              className="max-w-4xl p-4 mx-auto overflow-hidden bg-white rounded-3xl sm:p-6 lg:p-8"
              style={{ boxShadow: cardShadow }}
              ref={cardRef}
            >
              <form
                className="space-y-8 divide-y divide-gray-200"
                onSubmit={handleSubmit(onSubmitValid)}
              >
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        질문 만들기
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        작성한 내용은 모두에게 보여집니다. 바르고 고운말을
                        사용해주세요.
                      </p>
                    </div>

                    {!photo ? (
                      <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            커버 이미지
                          </label>
                          <label
                            htmlFor="photo"
                            ref={imageFormRef}
                            tabIndex={0}
                            className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md outline-none cursor-pointer hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 ring-0"
                          >
                            <div className="space-y-1 text-center">
                              <svg
                                className="w-12 h-12 mx-auto text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex justify-center text-sm text-gray-600">
                                <span className="relative font-medium text-indigo-600 rounded-md">
                                  <span>이미지 업로드</span>
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG 최대 5MB
                              </p>
                              <FormError message={fileError} />
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="relative flex justify-center rounded-lg bg-gray-50">
                          <img
                            src={photo.url}
                            alt={photo.file.name}
                            className="object-contain"
                            style={{ height: 400 }}
                          />
                          <button
                            onClick={onDeleteClick}
                            type="button"
                            className="inline-flex absolute top-10 right-10 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap"
                          >
                            <FontAwesomeIcon
                              icon={faMinusCircle}
                              className="relative w-3 h-3 mr-2 text-xs"
                            />
                            제거
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg, image/png"
                      onChange={onFileChange}
                    />
                  </div>

                  <div className="pt-8">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        질문 내용
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        참여한 사용자가 있을시 게시물의 수정이 불가능 합니다.
                        신중히 작성해주세요.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium text-gray-700"
                        >
                          내용
                        </label>
                        <div className="mt-1">
                          <textarea
                            {...register("content", {
                              required: "내용은 필수 항목입니다.",
                            })}
                            id="content"
                            name="content"
                            className="block w-full h-24 border-gray-300 rounded-md shadow-sm resize-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <FormError
                            message={formState?.errors?.content?.message}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="firstPick"
                          className="block text-sm font-medium text-gray-700"
                        >
                          선택 1
                        </label>
                        <div className="mt-1">
                          <input
                            {...register("firstPick", {
                              required: "선택 1 은 필수 항목입니다.",
                            })}
                            type="text"
                            name="firstPick"
                            id="firstPick"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <FormError
                            message={formState?.errors?.firstPick?.message}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="secondPick"
                          className="block text-sm font-medium text-gray-700"
                        >
                          선택 2
                        </label>
                        <div className="mt-1">
                          <input
                            {...register("secondPick", {
                              required: "선택 2 는 필수 항목입니다.",
                            })}
                            type="text"
                            name="secondPick"
                            id="secondPick"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <FormError
                            message={formState?.errors?.secondPick?.message}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label
                          htmlFor="questionHashtags"
                          className="block text-sm font-medium text-gray-700"
                        >
                          해시태그
                          <span className="ml-2 text-xs text-gray-500">
                            (선택)
                          </span>
                        </label>
                        <div className="mt-1">
                          <input
                            {...register("questionHashtags")}
                            type="text"
                            name="questionHashtags"
                            id="questionHashtags"
                            placeholder="#해시태그 #입니다 ..."
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    {!loading && (
                      <Link href={routes.home}>
                        <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          취소
                        </a>
                      </Link>
                    )}
                    <button
                      type={loading ? "button" : "submit"}
                      disabled={loading}
                      className={`inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? "opacity-50" : ""
                      }`}
                    >
                      {loading ? "기다리는 중..." : "만들기"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </ContentSection>
      </Layout>
    </>
  );
}
