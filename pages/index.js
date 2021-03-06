import Link from 'next/link';
import moment from 'moment';
import Nav from '../components/nav';
import { getAllArticles, convertCanonicalURLToRelative } from '../lib/devto';

export default function IndexPage({ articles }) {
  return (
    <div className="bg-gray-50">
      <Nav />
      <div className="py-20 flex flex-col justify-center items-center">
        <h1 className="text-3xl">Welcome to my blog 👋</h1>
        <p className="max-w-2xl text-center my-4">All the articles you see are dynamically loaded from Dev.to at build time. The website is refreshed whenever an article is created or updated.</p>
        {/* If no articles are returned from Dev.to, show instructions on how to make them show by adding a canonical URL */}
        {articles && articles.length > 0 ? (
          articles.map(article => (
            <Link href={convertCanonicalURLToRelative(article.canonical_url)} key={article.id}>
              <a className="mt-6 w-full flex flex-col items-center">
                  <div className="lg:w-2/5 md:w-3/5 w-4/5 px-10 py-6 bg-white rounded-lg shadow-md">
                      <div className="flex justify-between items-center">
                          <span className="font-light text-gray-600">
                              {moment(article.published_timestamp).format('Do MMMM YYYY')}
                          </span>
                          <span className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500">
                              {article.tag_list.join(', ')}
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
          ))) : (
            <div className="mt-12">
              <h2 className="text-xl">No valid articles returned from Dev.to</h2>
              <p className="my-2">To make an article show on your website you need to add a canonical URL to it which points at this website.</p>
              <p className="my-2">This is easy to do:</p>
              <ol className="my-2 ml-8 list-decimal">
                <li>Navigate to Dev.to and open one of your articles (alternatively create a new article!)</li>
                <li>Enter editor mode</li>
                <li>Scroll to the bottom of the article, click on the settings cog next to "Save changes"</li>
                <li>In the "Canonical URL" input box enter your blog's domain name and a path for the blog to be made available on</li>
                <li>For example, I would enter "https://dev-to-blog.james-wallis.vercel.app/deploy-nextjs-on-vercel" which is domain name + path for blog</li>
              </ol>
            </div>
          )
        }
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
