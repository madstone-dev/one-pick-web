import Layout from "../../components/auth/Layout";
import { getRefreshToken } from "../../src/utils/auth.utils";
import { routes } from "../../src/routes";
import ProfileAside from "../../components/users/ProfileAside";
import useUser from "../../src/hooks/useUser";
import UpdateUserForm from "../../components/users/UpdateUserForm";
import DeleteUserForm from "../../components/users/DeleteUserForm";
import { NextSeo } from "next-seo";

export default function UserProfile() {
  const { data: userData } = useUser();

  return (
    <>
      <NextSeo title="계정 설정" />
      <Layout>
        <main className="w-full pb-10 mx-auto max-w-7xl lg:py-12 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <ProfileAside />

            <div className="px-4 space-y-8 sm:px-6 lg:px-8 lg:col-span-9">
              <UpdateUserForm userData={userData} />
              <DeleteUserForm />
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }: any) {
  const token = getRefreshToken({ req, res });
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: routes.home,
      },
    };
  }
  return {
    props: {},
  };
}
