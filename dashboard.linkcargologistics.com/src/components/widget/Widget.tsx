'use client'
import { FC, ReactNode } from "react";
import Card from "@/components/card";
import Link from "next/link";

type Props = {
  icon?: ReactNode | string;
  title?: string;
  subtitle?: string;
  url?: string;
}

const Widget: FC<Props> = ({ icon, title, subtitle, url }) => {
  const content = (
    <Card className="!flex-row flex-grow items-center rounded-[20px]">
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {subtitle}
        </h4>
      </div>
    </Card>
  );

  return url ? <Link href={url}>{content}</Link> : content;
};

export default Widget;
