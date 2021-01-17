import fs from 'fs';
import path from 'path';
import { getAllArticlesAndMinifyForCache, getArticleFromCache } from '../lib/devto';

import Nav from '../components/nav'

// This file is used for caching the article ID and local slug
const cacheFile = '.dev-to-cache.json'; // Add this file to the .gitignore

const ArticlePage = ({ article }) => (
    <div className="bg-gray-50">
        <Nav />
        <main>
            <div className="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative h-96">
                <div className="absolute left-0 bottom-0 w-full h-full z-10" style={{ backgroundImage: 'linear-gradient(180deg,transparent,rgba(0,0,0,.7))' }} />
                {article.cover_image && <img src={article.cover_image} className="absolute left-0 top-0 w-full h-full z-0 object-cover" />}
                <div className="p-4 absolute bottom-0 left-0 z-20">
                    <span className="px-4 py-1 bg-black text-gray-200 items-center justify-center mb-2">
                        {article.tag_list}
                    </span>
                <h2 className="text-4xl font-semibold text-gray-100 leading-tight">
                    {article.title}
                </h2>
                <div className="flex mt-3">
                    <p className="font-semibold text-gray-200 text-sm">
                        {article.readable_publish_date}
                    </p>
                </div>
                </div>
            </div>

            <div className="px-4 lg:px-0 mt-8 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
                <div className="flex justify-center text-md my-4 italic text-gray-700 font-bold hover:underline">
                    <a href={article.url} target="_blank">Also posted on Dev.to</a>
                </div>
                <div className="article" dangerouslySetInnerHTML={{ __html: article.body_html }} />
                <div className="flex justify-center text-md mt-10 mb-32 italic text-gray-700 font-bold hover:underline">
                    <a href={article.url} target="_blank">Like this article? React or comment on Dev.to</a>
                </div>
            </div>
        </main>
    </div>
)

// This function gets called at build time
export async function getStaticPaths() {
    // Get minified articles (just article ID and local slug) and cache them for use in getStaticProps
    const minifiedArticles = await getAllArticlesAndMinifyForCache();

    // Save minified article data to cache file
    fs.writeFileSync(path.join(process.cwd(), cacheFile), JSON.stringify(minifiedArticles));

    // Get the paths we want to pre-render based on posts
    const paths = minifiedArticles.map(({ slug }) => {
        return {
            params: { slug },
        }
    })

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    // Read cache and parse to object
    const cacheContents = fs.readFileSync(path.join(process.cwd(), cacheFile));
    const cache = JSON.parse(cacheContents);

    // Using the cache, fetch the article from Dev.to
    const article = await getArticleFromCache(cache, params.slug);

    return { props: { article } }
}

export default ArticlePage;