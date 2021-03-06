import { ArrowUpIcon } from "@heroicons/react/solid";
import { actionButtonShadow } from "../src/utils/utils";

export default function ScrollToTop() {
  const onClick = () => {
    if (process.browser) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed z-30 bottom-8 right-4">
      <div className="flex flex-col space-y-4">
        <button
          onClick={onClick}
          className="block p-3 font-bold bg-white border rounded-full border-gray-50"
          style={{ boxShadow: actionButtonShadow }}
        >
          <ArrowUpIcon className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
