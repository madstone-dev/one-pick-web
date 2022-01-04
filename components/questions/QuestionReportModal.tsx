import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FlagIcon } from "@heroicons/react/solid";
import { gql, useMutation } from "@apollo/client";

const REPORT_QUESTION_MUTATION = gql`
  mutation createQuestionReport($id: Int!, $type: Int!) {
    createQuestionReport(id: $id, type: $type) {
      ok
      error
    }
  }
`;

export default function QuestionReportModal({ question }: any) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [reportQuestion] = useMutation(REPORT_QUESTION_MUTATION);
  const reportTypes = [
    { label: "상업성 콘텐츠 또는 스팸", value: "1" },
    { label: "증오심 표현 또는 노골적인 폭력", value: "2" },
    { label: "희롱 또는 괴롭힘", value: "3" },
  ];
  const [reportType, setReportType] = useState<any>(null);

  const onClickReport = () => {
    reportQuestion({
      variables: {
        id: question.id,
        type: parseInt(reportType),
      },
    });
    setOpen(false);
    alert("신고 완료");
  };

  return (
    <>
      <button
        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        onClick={() => setOpen(true)}
      >
        콘텐츠 신고
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
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
              afterLeave={() => {
                setReportType(null);
              }}
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
                      콘텐츠 신고
                    </Dialog.Title>
                    <div className="mt-8 space-y-4">
                      {reportTypes.map((item, index) => (
                        <label className="flex items-center" key={index}>
                          <input
                            name="questionReport"
                            type="radio"
                            value={item.value}
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            onChange={() => {
                              setReportType(item.value);
                            }}
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
                      reportType
                        ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        : "text-gray-600 bg-gray-100 pointer-events-none"
                    } inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm sm:ml-3 sm:w-auto sm:text-sm`}
                    onClick={onClickReport}
                  >
                    보내기
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setOpen(false);
                    }}
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
    </>
  );
}
