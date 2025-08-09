import axios from "axios";

export default defineComponent({
  async run({ steps }) {
    const latestArticle = steps.sort_latest_news.$return_value;

    const zapierWebhookUrl = "https://hooks.zapier.com/hooks/catch///";

try {
      await axios.post(zapierWebhookUrl, {
        title: latestArticle.title,
        link: latestArticle.link,
        description: latestArticle.description,
        image: latestArticle.image,
        pubDate: latestArticle.pubDate
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to send data to Zapier:", error);
      throw error;
    }
  }
});
