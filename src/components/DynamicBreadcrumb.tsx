"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function DynamicBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .slice(1); // pomijamy locale

  const locale = pathname.split("/")[1];

  const buildHref = (i: number) =>
    `/${locale}/${segments.slice(0, i + 1).join("/")}`;

  const formatLabel = (str: string) =>
    str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;

          return (
            <Fragment key={i}>
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink href={buildHref(i)}>
                    {formatLabel(segment)}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
