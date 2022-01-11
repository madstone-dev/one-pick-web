import { makeVar } from "@apollo/client";

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const loadContentFinishVar = makeVar(false);

export const reportTypes = [
  { label: "상업성 콘텐츠 또는 스팸", value: "1" },
  { label: "증오심 표현 또는 노골적인 폭력", value: "2" },
  { label: "희롱 또는 괴롭힘", value: "3" },
];

export const tabHeightVar = makeVar<any>(0);
