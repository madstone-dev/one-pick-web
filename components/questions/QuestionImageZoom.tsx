import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/pro-regular-svg-icons";

export default function QuestionImageZoom({ image }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="absolute flex items-center justify-center w-10 h-10 bg-white rounded-full right-3 bottom-3 bg-opacity-80 hover:bg-opacity-100"
        onClick={() => {
          setOpen(true);
        }}
      >
        <FontAwesomeIcon
          icon={faExpand}
          className="w-5 h-5 text-xl text-gray-400 hover:text-gray-500"
        />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-8">
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
            >
              <div className="inline-block max-w-screen-md overflow-hidden text-left align-bottom transition-all transform bg-white shadow-2xl rounded-2xl sm:my-8 sm:align-middle sm:w-full">
                <div className="absolute top-0 right-0 block pt-4 pr-4">
                  <button
                    type="button"
                    className="p-2 text-gray-400 bg-white rounded-full hover:text-gray-500 bg-opacity-80 hover:bg-opacity-100"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">닫기</span>
                    <XIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex">
                  <img
                    src={image}
                    alt="확대 이미지"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
