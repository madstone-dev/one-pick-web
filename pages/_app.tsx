import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../src/apolloClient";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <DefaultSeo
        defaultTitle="원픽"
        titleTemplate="%s | 원픽"
        openGraph={{
          type: "website",
          title: "둘 중에 하나만 골라, 원픽!",
          description: "선택하세요 원픽",
          site_name: "원픽",
        }}
      />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
