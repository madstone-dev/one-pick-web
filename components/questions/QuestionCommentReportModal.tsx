import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FlagIcon } from "@heroicons/react/solid";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { createQuestionCommentReport } from "../../src/__generated__/createQuestionCommentReport";
import { showQuestionComments_showQuestionComments } from "../../src/__generated__/showQuestionComments";
import { reportTypes } from "../../src/utils/utils";

const REPORT_QUESTION_COMMENT_MUTATION = gql`
  mutation createQuestionCommentReport($id: Int!, $type: Int!) {
    createQuestionCommentReport(id: $id, type: $type) {
      ok
      error
    }
  }
`;

interface IquestionCommentReportModal {
  comment: showQuestionComments_showQuestionComments;
  reportOpen: boolean;
  setReportOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QuestionCommentReportModal({
  comment,
  reportOpen,
  setReportOpen,
}: IquestionCommentReportModal) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, watch, setValue } = useForm();
  const [reportQuestionCommentMutation] =
    useMutation<createQuestionCommentReport>(REPORT_QUESTION_COMMENT_MUTATION);

  useEffect(() => {
    setReportOpen(open);
  }, [open]);

  useEffect(() => {
    if (reportOpen) {
      setOpen(reportOpen);
    }
  }, [reportOpen]);

  const onValid = () => {
    reportQuestionCommentMutation({
      variables: {
        id: comment.id,
        type: parseInt(watch("commentReport")),
      },
    });
    setOpen(false);
    alert("신고 완료");
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              setValue("commentReport", null);
            }}
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-gray-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <FlagIcon
                    className="w-6 h-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    댓글 신고
                  </Dialog.Title>
                  <div className="mt-8 space-y-4">
                    {reportTypes.map((item, index) => (
                      <label className="flex items-center" key={index}>
                        <input
                          {...register("commentReport", {
                            required: true,
                          })}
                          type="radio"
                          value={item.value}
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="block ml-3 text-base font-medium text-gray-700">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`${
                    watch("commentReport")
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      : "text-gray-600 bg-gray-100 pointer-events-none"
                  } inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleSubmit(onValid)}
                >
                  보내기
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  취소
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
