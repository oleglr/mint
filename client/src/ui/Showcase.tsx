import Link from 'next/link';

type ShowcaseItem = {
  name: string;
  link: string;
  linkText: string;
  description: string;
  logo: string;
  screenshot: string;
};

const Showcase = ({ items }: { items: ShowcaseItem[] }) => {
  return (
    <ul className="not-prose grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-2 xl:gap-y-10">
      {items.map((item) => {
        const { name, link, logo, description } = item;

        return (
          <Link href={link}>
            <a target="_blank" rel="noopener noreferrer">
            <li className="relative flex items-start">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl ring-1 ring-slate-300/10 shadow overflow-hidden flex-none dark:bg-slate-100">
              <img className="block w-8" src={logo} alt={name} />
            </div>
            <div className="peer group flex-auto ml-6">
              <h3 className="mb-1.5 font-semibold text-slate-900 dark:text-slate-200">
                <span className="before:absolute before:-inset-3 before:rounded-2xl sm:before:-inset-4">{name}
                <svg viewBox="0 0 3 6" className="ml-3 w-auto h-1.5 overflow-visible inline -mt-px text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                  <path d="M0 0L3 3L0 6" fill="none" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </span>
              </h3>
                <div className="prose prose-slate prose-sm text-slate-600 dark:prose-dark">
                  <p>{description}</p>
                  </div>
                </div>
                <div className="absolute -z-10 -inset-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 opacity-0 peer-hover:opacity-100 sm:-inset-4"></div>
                </li>
            </a>
          </Link>
        );
      })}
    </ul>
  );
};

export default Showcase;
