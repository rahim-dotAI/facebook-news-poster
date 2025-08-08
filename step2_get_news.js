
import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    const gNewsApiKey = process.env.GNEWS_API_KEY;
    const newsDataApiKey = process.env.NEWSDATA_API_KEY;

    function isBlockedLink(url) {
      if (!url) return true;
      const lowerUrl = url.toLowerCase();
      return lowerUrl.includes("manilabulletin") || lowerUrl.startsWith("https://mb.com.ph");
    }

    async function getGNewsArticles() {
      if (!gNewsApiKey) {
        console.warn("No GNEWS_API_KEY provided");
        return [];
      }
      try {
        console.log("Fetching GNews API");
        const res = await axios.get(`https://gnews.io/api/v4/top-headlines?token=${gNewsApiKey}&lang=en&max=10`, { timeout: 10000 });
        const filteredArticles = (res.data.articles || []).filter(a => 
          a.image && !a.image.toLowerCase().includes("google") && !a.image.toLowerCase().includes("logo") &&
          a.url && !isBlockedLink(a.url)
        );
        console.log(`GNews returned ${filteredArticles.length} usable articles`);
        return filteredArticles.slice(0, 5).map(a => ({
          title: a.title,
          link: a.url,
          pubDate: a.publishedAt,
          description: a.description,
          image: a.image
        }));
      } catch (e) {
        console.error("GNews API error:", e.message);
        return [];
      }
    }

    async function getNewsDataArticles() {
      if (!newsDataApiKey) {
        console.warn("No NEWSDATA_API_KEY provided");
        return [];
      }
      try {
        console.log("Fetching NewsData API");
        const res = await axios.get(`https://newsdata.io/api/1/news?apikey=${newsDataApiKey}&language=en&category=top`, { timeout: 10000 });
        const filteredResults = (res.data.results || []).filter(a => 
          a.image_url && !a.image_url.toLowerCase().includes("google") && !a.image_url.toLowerCase().includes("logo") &&
          a.link && !isBlockedLink(a.link)
        );
        console.log(`NewsData returned ${filteredResults.length} usable results`);
        return filteredResults.slice(0, 5).map(a => ({
          title: a.title,
          link: a.link,
          pubDate: a.pubDate,
          description: a.description,
          image: a.image_url
        }));
      } catch (e) {
        console.error("NewsData API error:", e.message);
        return [];
      }
    }

    // Try GNews first
    let articles = await getGNewsArticles();

    // If none found or empty, try NewsData API
    if (!articles || articles.length === 0) {
      articles = await getNewsDataArticles();
    }

    if (!articles || articles.length === 0) {
      throw new Error("No usable news articles found from either API.");
    }

    return articles;
  }
});
