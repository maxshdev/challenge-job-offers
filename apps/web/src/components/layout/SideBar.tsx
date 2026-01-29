"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import {
  IconHome,
  IconUsers,
  IconConfig,
  IconPage,
  IconWebhook,
  IconLayoutBoard,
  IconSettings,
  IconLogout,
  IconInvoice
} from "../Icons";

export default function Sidebar() {

  const t = useTranslations('Platform.Sidebar');
  const pathname = usePathname();
  const locale = useLocale();

  const sections = [
    {
      title: t("common"),
      items: [
        { label: t("dashboard"), href: `/${locale}/admin/dashboard`, icon: <IconHome className="my-1.5 inline-block size-4" /> }
      ],
    },
    {
      title: t("content"),
      items: [
        { label: "Facturación", href: `/${locale}/admin/invoices`, icon: <IconInvoice className="my-1.5 inline-block size-4" /> },
        { label: t("pages"), href: `/${locale}/admin/pages`, icon: <IconPage className="my-1.5 inline-block size-4" /> },
        { label: t("integrations"), href: `/${locale}/admin/integrations`, icon: <IconWebhook className="my-1.5 inline-block size-4" /> },
        { label: t("themes"), href: `/${locale}/admin/themes`, icon: <IconLayoutBoard className="my-1.5 inline-block size-4" /> },
        { label: t("jobs"), href: `/${locale}/admin/jobs`, icon: <IconWebhook className="my-1.5 inline-block size-4" /> },
        { label: t("job-applications"), href: `/${locale}/admin/job-applications`, icon: <IconWebhook className="my-1.5 inline-block size-4" /> },
        { label: t("job-subscriptions"), href: `/${locale}/admin/job-subscriptions`, icon: <IconWebhook className="my-1.5 inline-block size-4" /> },
        { label: "Trades", href: `/${locale}/admin/trades`, icon: <IconLayoutBoard className="my-1.5 inline-block size-4" /> },
      ],
    },
    {
      title: t("scheme"),
      items: [
        { label: t("users"), href: `/${locale}/admin/users`, icon: <IconUsers className="my-1.5 inline-block size-4" /> },
        { label: t("configuration"), href: `/${locale}/admin/settings`, icon: <IconSettings className="my-1.5 inline-block size-4" /> },
        { label: t("myAccount"), href: `/${locale}/admin/account/edit`, icon: <IconConfig className="my-1.5 inline-block size-4" /> },
      ],
    },
    {
      title: t("session"),
      items: [
        { label: t("logout"), href: "/api/auth/signout", icon: <IconLogout className="my-1.5 inline-block size-4" /> },
      ],
    },
  ];

  return (
    <>
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

        <div className="flex min-h-full flex-col items-start bg-base-200 border-r border-base-300 is-drawer-close:w-14 is-drawer-open:w-64">

          <ul className="menu w-full grow">

            {sections.flatMap((section, idx) => {
              return [
                <li key={`${idx}-title`} className="menu-title is-drawer-close:hidden">
                  <span>{section.title}</span>
                </li>,

                ...section.items.map((item, i) => {
                  const active =
                    pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <li key={`${idx}-${i}`}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-2 
                          is-drawer-close:tooltip is-drawer-close:tooltip-right
                          ${active
                            ? "bg-primary text-primary-content font-semibold"
                            : "hover:bg-base-300"
                          }
                        `}
                        data-tip={item.label}
                      >
                        {item.icon}
                        <span className="is-drawer-close:hidden">{item.label}</span>
                      </Link>
                    </li>
                  );
                })
              ];
            })}

          </ul>

          {/* Toggle Drawer */}
          <div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Toggle">
            <label
              htmlFor="my-drawer-4"
              className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="inline-block size-4 my-1.5"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
          </div>

        </div>
      </div>
    </>
  );
}
