import Link from 'next/link';
import Nav from '../components/nav';
import { getAllArticles, convertCanonicalURLToRelative } from '../lib/devto';

export default function IndexPage({ articles }) {
  return (
    <div>
      <Nav />
      <div className="py-20 flex flex-col justify-center items-center">
        <h1 className="text-3xl">Welcome to my blog 👋</h1>
        <p className="max-w-2xl text-center my-4">All the articles you see are dynamically loaded from Dev.to at build time. The website is refreshed whenever an article is created or updated.</p>
        {articles.map(article => (
          <Link href={convertCanonicalURLToRelative(article.canonical_url)} key={article.id}>
            <a className="mt-6 w-full flex flex-col items-center">
                <div className="lg:w-2/5 md:w-3/5 w-4/5 px-10 py-6 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                        <span className="font-light text-gray-600">
                            {article.readable_publish_date}
                        </span>
                        <span className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500">
                            {article.tags}
                        </span>
                    </div>
                    <div className="mt-2">
                        <h3 className="text-2xl text-gray-700 font-bold hover:underline">
                            {article.title}
                        </h3>
                        <p className="mt-2 text-gray-600">
                            {article.description}
                        </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        Read more
                    </div>
                </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  // Get all the articles that have a canonical URL pointed to your blog
  const articles = await getAllArticles();

  // Pass articles to the page via props
  return { props: { articles } };
}
