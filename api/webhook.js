export default async function handler(req, res) {
    if (req.method === "POST") {
        const { discordUser, message } = req.body;

        if (!discordUser || !message) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // Your Discord webhook URL
        const discordWebhookUrl = "https://discord.com/api/webhooks/1314352301896499272/oYkd-9IO_URxpdyVchMEZ5it_QblhWwU1PJHnk85yc6dLBMUd_Awp4SM4BMUn_vek5QW";

        // Prepare the payload
        const payload = {
            content: `**${discordUser}**: ${message}`
        };

        try {
            const discordResponse = await fetch(discordWebhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!discordResponse.ok) {
                throw new Error("Failed to send message to Discord");
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
}
