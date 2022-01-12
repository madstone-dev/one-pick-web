import React from "react";
import Document from "next/document";
// @ts-ignore
import bundleCss from "!raw-loader!../styles/tailwindSSR.css";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const page = ctx.renderPage((App: any) => {
      const app = (props: any) => <App {...props} />;
      return app;
    });
    const initialProps: any = await Document.getInitialProps(ctx);

    return {
      ...page,
      styles: [
        ...initialProps.styles,
        <style
          key="custom"
          dangerouslySetInnerHTML={{
            __html: bundleCss,
          }}
        />,
      ],
    };
  }
}
