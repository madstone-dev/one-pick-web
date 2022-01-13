import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { headerHeightVar } from "../src/utils/auth.utils";
import {
  classNames,
  loadContentFinishVar,
  tabHeightVar,
} from "../src/utils/utils";

interface ItabsObj {
  name: string;
  to: string;
}

interface Itabs {
  tabs: ItabsObj[];
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}

export default function Tabs({ tabs, currentTab, setCurrentTab }: Itabs) {
  const tabsRef = useRef<any>();
  const [scrollHeight, setScrollHeight] = useState(0);

  const trackScroll = () => {
    setScrollHeight(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", trackScroll);
    setScrollHeight(window.scrollY);
    return () => {
      window.removeEventListener("scroll", trackScroll);
    };
  }, []);

  useEffect(() => {
    tabHeightVar(tabsRef.current.clientHeight);
  }, []);

  return (
    <div
      ref={tabsRef}
      className={`sticky z-30 bg-white lg:px-6 ${
        scrollHeight === 0 ? "" : "shadow-sm"
      }`}
      style={{
        top: `${headerHeightVar()}px`,
      }}
    >
      <div className="py-4">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <nav
            className="flex block mx-auto -mb-px space-x-8 w-fit"
            aria-label="Tabs"
          >
            {tabs.map((tab: any) => (
              <button
                key={tab.name}
                className={classNames(
                  tab.to === currentTab
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap py-2 px-1 border-b-4 text-sm font-semibold"
                )}
                aria-current={tab.to === currentTab ? "page" : undefined}
                onClick={() => {
                  loadContentFinishVar(false);
                  setCurrentTab(tab.to);
                }}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
