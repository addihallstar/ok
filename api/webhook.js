local lapis = require("lapis")
local http = require("resty.http")
local json = require("cjson")

local app = lapis.Application()

-- Discord webhook URL
local discordWebhookUrl = "https://discord.com/api/webhooks/1314352301896499272/oYkd-9IO_URxpdyVchMEZ5it_QblhWwU1PJHnk85yc6dLBMUd_Awp4SM4BMUn_vek5QW"

-- Function to send the message to Discord
local function sendToDiscord(discordUser, message)
    if not discordUser or not message then
        return { error = "Missing fields" }, 400
    end

    local payload = {
        content = "**" .. discordUser .. "**: " .. message
    }

    -- Use http client to make the POST request to Discord webhook
    local httpc = http.new()
    local res, err = httpc:request_uri(discordWebhookUrl, {
        method = "POST",
        headers = {
            ["Content-Type"] = "application/json"
        },
        body = json.encode(payload)
    })

    if not res then
        return { error = "Failed to send message to Discord: " .. (err or "Unknown error") }, 500
    end

    if res.status ~= 200 then
        return { error = "Failed to send message to Discord: " .. res.body }, 500
    end

    return { success = true }, 200
end

-- Route to handle POST requests
app:post("/sendMessage", function(self)
    local body = json.decode(self.body)
    local discordUser = body.discordUser
    local message = body.message

    local response, status = sendToDiscord(discordUser, message)

    self.status = status
    return response
end)

return app
