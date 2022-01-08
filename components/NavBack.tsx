import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

export default function NavBack() {
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  return (
    <div
      className="absolute top-0 left-0 hidden p-3 rounded-full cursor-pointer hover:bg-gray-100 lg:block w-fit focus:bg-gray-200"
      onClick={onClick}
    >
      <ArrowLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
    </div>
  );
}
