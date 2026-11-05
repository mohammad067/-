import type { ReactNode } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { SITE_CONTACT } from "@/config/site";

type PolicySection = {
  title: string;
  content: ReactNode;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

export function PolicyPage({ eyebrow, title, intro, sections }: PolicyPageProps) {
  return (
    <MainLayout>
      <article className="mx-auto w-full max-w-4xl px-4 py-12 text-right md:px-8 md:py-16">
        <header className="mb-10 rounded-3xl border border-[#E5E2DA] bg-white/70 p-6 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-bold text-accent">{eyebrow}</p>
          <h1 className="text-3xl font-extrabold leading-relaxed text-primary md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">{intro}</p>
        </header>

        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[#E5E2DA] bg-white/60 p-5 md:p-7">
              <h2 className="mb-3 text-lg font-bold text-primary md:text-xl">{section.title}</h2>
              <div className="space-y-3 text-sm leading-8 text-foreground/75 md:text-[15px]">{section.content}</div>
            </section>
          ))}
        </div>

        <aside className="mt-8 rounded-2xl bg-primary p-6 text-white">
          <h2 className="font-bold">پرسشی درباره این صفحه دارید؟</h2>
          <p className="mt-2 text-sm leading-7 text-white/80">
            با پشتیبانی طلای شالیزار به شماره{" "}
            <a className="font-bold text-white underline underline-offset-4" dir="ltr" href={SITE_CONTACT.phoneHref}>
              {SITE_CONTACT.phoneDisplay}
            </a>{" "}
            تماس بگیرید یا از صفحه تماس با ما استفاده کنید.
          </p>
          <Link className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-primary" href="/contact">
            تماس با ما
          </Link>
        </aside>
      </article>
    </MainLayout>
  );
}
