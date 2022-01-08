import { Ichildren } from "../src/interfaces";

export default function ContentSection({ children }: Ichildren) {
  return <div className="flex flex-1 w-full mx-auto max-w-7xl">{children}</div>;
}
