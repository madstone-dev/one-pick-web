import { Ichildren } from "../../src/interfaces";
import HeaderNav from "../HeaderNav";

export default function Layout({ children }: Ichildren) {
  return (
    <div className="flex flex-col items-stretch w-full h-full min-h-screen">
      <HeaderNav />
      <div className="flex flex-1 w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
