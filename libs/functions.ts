export const sendSMS = async ({ to, text }: { to: string; text: string }) => {
  const apiKey = process.env.INFOBIP_API_KEY;
  if (!apiKey) {
    throw new Error("INFOBIP_API_KEY is not set");
  }

  try {
    const response = await fetch(
      "https://6z952z.api.infobip.com/sms/3/messages",
      {
        method: "POST",
        headers: {
          Authorization: `App ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              destinations: [{ to }],
              sender: "RadDent",
              content: { text },
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.requestError?.serviceException?.text || "Failed to send SMS",
      );
    }

    return data;
  } catch (error: unknown) {
    console.error("SMS sending failed:", (error as Error).message);

    throw error; // let caller handle it
  }
};