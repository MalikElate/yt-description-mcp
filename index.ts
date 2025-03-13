import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { YoutubeTranscript } from 'youtube-transcript';
import getVideoId from 'get-video-id';
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "mcp-server-template",
  version: "0.0.1",
});

// Define a sample tool
server.tool(
  "youtube-transcript-extractor",
  "Extracts the transcript of a YouTube video.",
  {
    input: z.string().describe("a youtube video url"),
  },
  async ({ input }) => {
    const videoData = getVideoId(input);
    const output = await YoutubeTranscript.fetchTranscript(videoData.id as string).then((transcript: any) => {
      const text = transcript.map((t: any) => t.text).join(' ');
      return text;
    });

    return {
      content: [
        {
          type: "text",
          text: output,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
