export default defineComponent({
  async run({ steps }) {
    const articles = steps.get_news.$return_value;

    // Sort articles by pubDate descending (newest first)
    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Return only the first (latest) article
    return articles[0];
  }
});
