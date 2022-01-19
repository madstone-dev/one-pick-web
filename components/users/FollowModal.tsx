import { Dispatch, Fragment, ReactNode, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

interface IlistModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTransitionFinish: Dispatch<SetStateAction<boolean>>;
  quickClose: boolean;
  setQuickClose: Dispatch<SetStateAction<boolean>>;
  title: string;
  count: number;
  children: ReactNode;
}

export default function FollowModal({
  open,
  setOpen,
  setTransitionFinish,
  quickClose,
  setQuickClose,
  title,
  count,
  children,
}: IlistModal) {
  return (
    <>
      <button
        className="flex flex-col items-center justify-center"
        onClick={() => {
          setQuickClose(false);
          setOpen(true);
        }}
      >
        <span>{count}</span>
        <span className="whitespace-nowrap">{title}</span>
      </button>

      <Transition.Root
        show={open}
        as={Fragment}
        beforeEnter={() => {
          setTransitionFinish(false);
        }}
        beforeLeave={() => {
          setTransitionFinish(false);
        }}
        afterEnter={() => {
          setTransitionFinish(true);
        }}
        afterLeave={() => {
          setTransitionFinish(true);
        }}
      >
        <Dialog
          as="div"
          className={`${
            quickClose ? "hidden" : ""
          } fixed inset-0 z-50 overflow-y-auto`}
          onClose={setOpen}
        >
          <div className="relative z-50 flex items-center justify-center max-h-screen min-h-screen pt-20 pb-4 md:pt-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 touch-none" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <div
                className="fixed bottom-0 inline-flex w-full py-5 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl md:static rounded-t-3xl md:rounded-b-3xl touch-none md:align-middle md:max-w-md"
                style={{
                  maxHeight: "calc(100vh - 100px)",
                }}
              >
                <div className="absolute top-0 right-0 block pt-4 pr-4">
                  <button
                    type="button"
                    className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 mt-3">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-center text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="max-h-full px-4 mt-4 overflow-y-auto md:max-h-96 md:px-6">
                    {children}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
