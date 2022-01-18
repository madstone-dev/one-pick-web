import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { DotsVerticalIcon, XIcon } from "@heroicons/react/outline";

interface ImobileMenu {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  children: ReactNode;
  afterLeave?: Function;
}

export default function MobileMenu({
  open,
  setOpen,
  title,
  children,
  afterLeave,
}: ImobileMenu) {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className="flex items-center p-2 rounded-full sm:text-gray-600 bg-opacity-10 hover:bg-gray-100 sm:hover:text-gray-700 focus:outline-none"
          onClick={() => {
            setOpen(true);
          }}
        >
          <span className="sr-only">Open options</span>
          <DotsVerticalIcon
            className="w-4 h-4 rotate-90 lg:w-5 lg:h-5"
            aria-hidden="true"
          />
        </button>
      </div>
      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => {
          if (afterLeave) {
            afterLeave();
          }
        }}
      >
        <Dialog as="div" onClose={setOpen}>
          <div className="relative z-50 flex items-end justify-center max-h-screen min-h-screen">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="fixed bottom-0 inline-block w-full px-4 py-5 overflow-hidden text-left align-bottom transition-all transform bg-white shadow-xl touch-none rounded-t-3xl sm:align-middle sm:max-w-lg sm:px-6">
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
                <div className="mt-3 text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-medium text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                </div>
                <ul className="w-full pt-6 pb-16 space-y-3">{children}</ul>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
