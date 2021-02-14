import axios from 'axios';
import { sanitizeDevToMarkdown, convertMarkdownToHtml } from './markdown';

// CHANGE THESE
const websiteURL = 'https://wallis.dev/blog/'; // Change this to be the URL that Vercel assigned your blog, the https and tailing slash is required

// Takes an article from the Dev.to API, converts its Markdown to HTML for use in the blog [slug].js page
const convertDevtoResponseToArticle = (article) => {
    const localSlug = convertCanonicalURLToRelative(article.canonical_url);
    const markdown = sanitizeDevToMarkdown(article.body_markdown);
    const html = convertMarkdownToHtml(markdown);
    // Convert slug to local slug, sanitize Dev.to Markdown, convert Markdown to HTML
    return { ...article, localSlug, markdown, html };
}

// Get all users articles from Dev.to and filter by ones with a canonical URL to your blog
export const getAllArticles = async () => {
    const params = { per_page: 1000 };
    const headers = { 'api-key': process.env.DEVTO_APIKEY };
    const { data } = await axios.get(`https://dev.to/api/articles/me/published`, { params, headers });
    const articles = data.filter((article) => article.canonical_url.startsWith(websiteURL));
    // Convert markdown returned from Dev.to to html
    return articles.map(convertDevtoResponseToArticle);
}

// Takes a URL and returns the relative slug to your website
export const convertCanonicalURLToRelative = (canonicalURL) => {
    return canonicalURL.replace(websiteURL, '');
}

// Fetches an article from the cache using the localSlug that was created earlier (in convertDevtoResponseToArticle)
export const getArticleFromCache = async (cache, localSlug) => {
    // Get article from cache
    const cachedArticle = cache.find(cachedArticle => cachedArticle.localSlug === localSlug);
    return cachedArticle;
}
