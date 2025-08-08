\# Facebook News Poster Workflow



\## Steps:

1\. \*\*Trigger\*\* – Runs hourly at :00 to start workflow.

2\. \*\*get\_news\*\* – Fetches the latest news articles.

3\. \*\*sort\_latest\_news\*\* – Sorts articles by newest first.

4\. \*\*Send\_Post\_from\_Pipedream\*\* – Posts the latest article to Facebook.



\## Requirements

\- Facebook API credentials

\- News API credentials



\## Notes

Recreate the scheduled trigger in Pipedream when importing.



