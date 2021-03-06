import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { shouldRefetchQuestionsVar } from "../../../src/utils/questions.utils";
import { routes } from "../../../src/routes";
import { SHOW_QUESTIONS_FRAGMENT } from "../../../src/fragments";
import Layout from "../../../components/auth/Layout";
import FormError from "../../../components/auth/FormError";
import { SHOW_QUESTION_QUERY } from "../[id]";
import { HashLoader } from "react-spinners";
import NavBack from "../../../components/NavBack";
import ContentSection from "../../../components/ContentSection";
import { showQuestion } from "../../../src/__generated__/showQuestion";
import {
  updateQuestion,
  updateQuestionVariables,
} from "../../../src/__generated__/updateQuestion";
import { cardShadow, validateFileExtensions } from "../../../src/utils/utils";
import { NextSeo } from "next-seo";
import Compressor from "compressorjs";

const UPDATE_QUESTION_MUTATION = gql`
  mutation updateQuestion(
    $id: Int!
    $content: String
    $image: Upload
    $choice: [String!]
    $questionHashtags: String
  ) {
    updateQuestion(
      id: $id
      content: $content
      image: $image
      choice: $choice
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
  file: File | undefined;
}

interface IupdateQuestion extends updateQuestionVariables {
  firstPick: string;
  secondPick: string;
}

export default function EditQuestion() {
  const cardRef = useRef<any>();
  const [cardTop, setCardTop] = useState(0);
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const [editError, setEditError] = useState("");

  const { data: questionData, loading: showLoading } = useQuery<showQuestion>(
    SHOW_QUESTION_QUERY,
    {
      variables: {
        id,
      },
      skip: !id,
    }
  );

  const [photo, setPhoto] = useState<Iphoto>();
  const [fileError, setFileError] = useState("");

  const onCompleted = (data: updateQuestion) => {
    if (data.updateQuestion.ok) {
      shouldRefetchQuestionsVar(true);
      router.push(routes.home);
    } else {
      setEditError(data.updateQuestion.error || "");
    }
  };

  const [updateQuestionMutation, { loading }] = useMutation<updateQuestion>(
    UPDATE_QUESTION_MUTATION,
    {
      onCompleted,
    }
  );
  const { register, handleSubmit, formState, setValue } =
    useForm<IupdateQuestion>({
      mode: "onChange",
    });

  const onSubmitValid = (data: IupdateQuestion) => {
    updateQuestionMutation({
      variables: {
        id,
        content: data.content,
        choice: [data.firstPick, data.secondPick],
        image: photo?.file || undefined,
        questionHashtags: data.questionHashtags,
      },
    });
  };

  const onFileChange = (event: any) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    if (!validateFileExtensions(file)) {
      setFileError("jpg, png ????????? ???????????? ???????????????.");
      event.target.value = "";
      return;
    }
    if (file.size > 5242880) {
      setFileError("?????? 5MB ?????? ???????????????.");
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
  };

  useEffect(() => {
    if (questionData?.showQuestion) {
      const data = questionData?.showQuestion;
      if (!data.isMine) {
        alert("????????? ????????????.");
        router.push(routes.home);
      }
      if (data.image) {
        const photo = {
          url: data.image.Location,
          file: undefined,
        };
        setPhoto(photo);
      }
      setValue("content", data.content);
      setValue("firstPick", data.choice[0]);
      setValue("secondPick", data.choice[1]);
      setValue("questionHashtags", data.hashtagString);
      if (data.totalPickers > 0) {
        setEditError("???????????? ?????? ????????? ??????????????????.");
      }
    }
  }, [questionData, router, setValue]);

  useEffect(() => {
    if (cardRef?.current?.offsetTop) {
      setCardTop(cardRef?.current?.offsetTop);
    }
  }, [cardRef, setCardTop]);

  return (
    <>
      <NextSeo title="?????? ??????" />
      <Layout>
        <ContentSection>
          {showLoading && (
            <div className="flex items-center justify-center flex-1">
              <HashLoader color="#777777" loading={true} size={60} />
            </div>
          )}
          <div className={`${showLoading ? "hidden" : ""} w-full`}>
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
                          ?????? ??????
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          ????????? ????????? ???????????? ???????????????. ????????? ????????????
                          ??????????????????.
                        </p>
                      </div>

                      {!photo ? (
                        <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label
                              htmlFor="photo"
                              className="block text-sm font-medium text-gray-700"
                            >
                              ?????? ?????????
                            </label>
                            <label
                              htmlFor="photo"
                              className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
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
                                    <span>????????? ?????????</span>
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG ?????? 5MB
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
                              alt=""
                              className="object-contain"
                              style={{ height: 400 }}
                            />
                            <label
                              htmlFor="photo"
                              className="inline-flex cursor-pointer absolute top-10 right-10 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 whitespace-nowrap"
                            >
                              <FontAwesomeIcon
                                icon={faSyncAlt}
                                className="relative w-3 h-3 mr-2 text-xs"
                              />
                              ??????
                            </label>
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
                          ?????? ??????
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          ????????? ???????????? ????????? ???????????? ????????? ????????? ?????????.
                          ????????? ??????????????????.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700"
                          >
                            ??????
                          </label>
                          <div className="mt-1">
                            <textarea
                              {...register("content", {
                                required: "????????? ?????? ???????????????.",
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
                            ?????? 1
                          </label>
                          <div className="mt-1">
                            <input
                              {...register("firstPick", {
                                required: "?????? 1 ??? ?????? ???????????????.",
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
                            ?????? 2
                          </label>
                          <div className="mt-1">
                            <input
                              {...register("secondPick", {
                                required: "?????? 2 ??? ?????? ???????????????.",
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
                            ????????????
                            <span className="ml-2 text-xs text-gray-500">
                              (??????)
                            </span>
                          </label>
                          <div className="mt-1">
                            <input
                              {...register("questionHashtags")}
                              type="text"
                              name="questionHashtags"
                              id="questionHashtags"
                              placeholder="#???????????? #????????? ..."
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5">
                    <div
                      className={`${editError ? "mb-3" : ""} flex justify-end`}
                    >
                      <FormError message={editError} />
                    </div>
                    <div className="flex justify-end">
                      {!loading && (
                        <Link href={routes.home}>
                          <a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            ??????
                          </a>
                        </Link>
                      )}
                      {questionData?.showQuestion &&
                      questionData?.showQuestion?.totalPickers > 0 ? (
                        <button
                          type="button"
                          disabled={true}
                          className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-gray-400 bg-gray-200 border border-transparent rounded-md shadow-sm pointer-events-none"
                        >
                          ??????
                        </button>
                      ) : (
                        <button
                          type={loading ? "button" : "submit"}
                          disabled={loading}
                          className={`inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            loading ? "opacity-50" : ""
                          }`}
                        >
                          {loading ? "???????????? ???..." : "??????"}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </ContentSection>
      </Layout>
    </>
  );
}
