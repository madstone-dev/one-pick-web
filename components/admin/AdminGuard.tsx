import { useRouter } from "next/router";
import useUser from "../../src/hooks/useUser";
import { Ichildren } from "../../src/interfaces";
import { routes } from "../../src/routes";

export default function AdminGuard({ children }: Ichildren) {
  const { data } = useUser();
  const router = useRouter();
  if (process.browser && data?.me?.role) {
    if (data?.me?.role !== "admin") {
      router.push(routes.home);
    }
  }

  return <div>{data?.me?.role !== "admin" ? null : children}</div>;
}
