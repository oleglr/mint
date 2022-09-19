type Testimony = {
  image: string;
  name: string;
  title: string;
  content: string;
};

export function Testimonials({ testimonies }: { testimonies: Testimony[] }) {
  return (
    <ul className="not-prose space-y-4">
      {testimonies.map((testimony, i) => (
        <li className="text-sm leading-6">
          <figure className="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
            <blockquote className="mt-4 text-slate-700 dark:text-slate-300">
              <p>{testimony.content}</p>
            </blockquote>
            <figcaption className="flex items-center space-x-4">
              <img
                src={testimony.image}
                alt=""
                className="flex-none w-12 h-12 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex-auto">
                <div className="text-base text-slate-900 font-semibold dark:text-slate-300">
                  <a
                    tabIndex={i}
                  >
                    {testimony.name}
                  </a>
                </div>
                <div className="mt-0.5">{testimony.title}</div>
              </div>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
