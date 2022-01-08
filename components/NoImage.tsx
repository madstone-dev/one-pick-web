interface InoImage {
  className?: string;
  title?: string;
}

export default function NoImage({ className, title }: InoImage) {
  return (
    <div
      className={`flex items-center justify-center w-full text-2xl font-bold text-gray-400 bg-gray-200 h-32 sm:h-40 md:h-60 p-6 ${className}`}
    >
      {title ? title : "No Image"}
    </div>
  );
}
