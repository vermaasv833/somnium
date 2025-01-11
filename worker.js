// -------------------------------------- //
// ---------- Insert Your Data ---------- //
// -------------------------------------- //

const BOT_TOKEN = "7743967796:AAHlKbRSy8b8LsVRbzqRIkyx8QGi35JiTug"; // Insert your bot token.
const BOT_WEBHOOK = "/endpoint"; // Let it be as it is.
const BOT_SECRET = "BOT_SECRET"; // Insert a powerful secret text (only [A-Z, a-z, 0-9, _, -] are allowed).
const BOT_OWNER = 7825674005; // Insert your telegram account id.
const PUBLIC_BOT = false; // Make your bot public (only [true, false] are allowed).

// ----------------------------------- //
// ---------- Do Not Modify ---------- //
// ----------------------------------- //

const HEADERS_ERRR = {'Access-Control-Allow-Origin': '*', 'content-type': 'application/json'};
const ERROR_404 = { 'action':'error', 'status': 403, 'text': 'Nothing to see here.', "credit": "https://github.com/vauth/somnium"};
const ERROR_403 = { 'action':'error', 'status': 403, 'text': 'Process failed or contains NSFW.'}
const ERROR_402 = { 'action':'error', 'status': 402, 'text': 'Unexpected error has occurred.'};

// ------------------------------------ //
// ---------- Event Listener ---------- //
// ------------------------------------ //

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event))
});

async function handleRequest(event) {
    const url = new URL(event.request.url);
     
    if (url.pathname === BOT_WEBHOOK) {return Telegram.handleWebhook(event)}
    if (url.pathname === '/registerWebhook') {return Telegram.registerWebhook(event, url, BOT_WEBHOOK, BOT_SECRET)}
    if (url.pathname === '/unregisterWebhook') {return Telegram.unregisterWebhook(event)}
    if (url.pathname === '/getMe') {return new Response(JSON.stringify(await Telegram.getMe()), {headers: HEADERS_ERRR, status: 202})}
    
    return new Response(JSON.stringify(ERROR_404), {status: 200, headers: HEADERS_ERRR});
}

// --------------------------------- //
// ---------- Raise Error ---------- //
// --------------------------------- //

async function Raise(json_error, status_code) {
    return new Response(JSON.stringify(json_error), { headers: HEADERS_ERRR, status: status_code });
}

// --------------------------------- //
// --------- Somnium Class --------- //
// --------------------------------- //

class Somnium {
  static async GetHeader() {
      let r1 = await fetch('https://dream.ai/create');
      let r1Data = await r1.text();
      const jsfile = (r1Data.match(/_app-(\w+)/) || [])[1];
      let r2 = await fetch(`https://dream.ai/_next/static/chunks/pages/_app-${jsfile}.js`);
      let r2Data = await r2.text();
      let googlekey = (r2Data.match(/"(AI\w+)"/) || [])[1];
      
      let headers = {
          "authority": "identitytoolkit.googleapis.com",
          "accept": "*/*",
          "accept-language": "ru,en;q=0.9",
          "content-type": "application/json",
          "origin": "https://dream.ai",
          "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "YaBrowser";v="23"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          "x-client-version": "Chrome/JsCore/9.1.2/FirebaseCore-web",
      };
      
      let params = { key: googlekey };
      let data = { returnSecureToken: true };
      
      let url = new URL("https://identitytoolkit.googleapis.com/v1/accounts:signUp");
      url.search = new URLSearchParams(params).toString();
  
      let response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data),
      });
      let responseData = await response.json();
      let TOKEN = responseData.idToken
      
      return {
          "authority": "paint.api.wombo.ai",
          "accept": "*/*",
          "accept-language": "ru,en;q=0.9",
          "authorization": `bearer ${TOKEN}`,
          "content-type": "text/plain;charset=UTF-8",
          "origin": "https://dream.ai",
          "referer": "https://dream.ai/",
          "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "YaBrowser";v="23"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 YaBrowser/23.3.1.895 Yowser/2.5 Safari/537.36",
          "x-app-version": "WEB-2.0.0",
      }
  }

  static async Generate(prompt, style) {
      const { styles } = await this.Styles();
      if (!styles.hasOwnProperty(style)) {
          return { action: "error", status: 402 };
      }

      const headers = await this.GetHeader();
      const customStyles = await this.CustomStyles();

      const customIds = Object.fromEntries(Object.entries(customStyles).map(([key, value]) => [parseInt(value['id']), key]));

      let textQ;
      let styleQ;

      if (Object.keys(customIds).includes(style.toString())) {
          textQ = customStyles[customIds[style]]['prompt'].replace('{PROMPT}', prompt);
          styleQ = parseInt(customStyles[customIds[style]]['style']);
      } else {
          textQ = prompt;
          styleQ = style;
      }

      const data = {
          "is_premium": false,
          "input_spec": {
              "prompt": textQ,
              "style": styleQ,
              "display_freq": 10
          }
      };

      let genResponse = await fetch('https://paint.api.wombo.ai/api/v2/tasks', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
      });

      genResponse = await genResponse.json();
      try {
          const image_id = genResponse['id'];
          for (let i = 0; i < 10; i++) {
              let response = await fetch(`https://paint.api.wombo.ai/api/v2/tasks/${image_id}`, {
                  method: 'GET',
                  headers: headers,
              });
              response = await response.json();
              if (response['state'] == 'failed') {
                  return ERROR_403;
              }
              await new Promise(r => setTimeout(r, 3000));
              try {
                  const img = response['result'];
                  if (img != null) {
                      return { action: "success", status: 200, image: img['final'] };
                  } else {
                      continue;
                  }
              } catch {
                  continue;
              }
          }
      } catch (error) {
          return ERROR_402;
      }
  }

  static async CustomStyles() {
      const styles = await fetch('https://raw.githubusercontent.com/Vauth/custom/main/styles.json');
      return await styles.json();
  }

  static async DefaultStyles() {
      const styles = await fetch("https://paint.api.wombo.ai/api/styles");
      return await styles.json();
  }

  static async Styles() {
      const Dstyles = await this.DefaultStyles();
      const Cstyles = await this.CustomStyles();
      const alls = Object.fromEntries(Object.entries(Cstyles).map(([key, value]) => [value['id'], { "name": key, "image": value['image'] }]));
      Dstyles.forEach((style) => { if (!style.is_premium) { alls[style.id] = { "name": style['name'], "image": style['photo_url'] } } });
      return { action: "success", status: 200, styles: alls };
  }
}

// ------------------------------------ //
// ---------- Telegram Class ---------- // 
// ------------------------------------ //

class Telegram {
  static async handleWebhook(event) {
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== BOT_SECRET) {
      return new Response('Unauthorized', { status: 403 })
    }
    const update = await event.request.json()
    event.waitUntil(this.Update(event, update))
    return new Response('Ok')
  }

  static async registerWebhook(event, requestUrl, suffix, secret) {
    const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
    const response = await fetch(await this.apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))
    return new Response(JSON.stringify(await response.json()), {headers: HEADERS_ERRR})
  }

  static async unregisterWebhook(event) { 
    const response = await fetch(await this.apiUrl('setWebhook', { url: '' }))
    return new Response(JSON.stringify(await response.json()), {headers: HEADERS_ERRR})
  }

  static async getMe() {
    const response = await fetch(await this.apiUrl('getMe'))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async sendMessage(chat_id, text, reply_id, reply_markup=[]) {
    const response = await fetch(await this.apiUrl('sendMessage', {chat_id: chat_id, reply_to_message_id: reply_id, parse_mode: 'markdown', text, reply_markup: JSON.stringify({inline_keyboard: reply_markup})}))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async sendPhoto(chat_id, photo, reply_id, reply_markup=[], caption="") {
    const response = await fetch(await this.apiUrl('sendPhoto', {chat_id: chat_id, photo: photo, reply_to_message_id: reply_id, parse_mode: 'markdown', caption: caption, reply_markup: JSON.stringify({inline_keyboard: reply_markup})}))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async sendDocument(chat_id, document, reply_id, reply_markup=[], caption="") {
    const response = await fetch(await this.apiUrl('sendDocument', {chat_id: chat_id, document: document, reply_to_message_id: reply_id, parse_mode: 'markdown', caption: caption, reply_markup: JSON.stringify({inline_keyboard: reply_markup})}))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async deleteMessage(chat_id, message_id) {
    const response = await fetch(await this.apiUrl('deleteMessage', {'chat_id': chat_id, 'message_id': message_id}))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async answerCallback(query_id, text) {
    const response = await fetch(await this.apiUrl('answerCallbackQuery', {'callback_query_id': query_id, 'text': text}))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async editMessageReplyMarkup(chat_id, message_id, reply_markup=[]) {
    const response = await fetch(await this.apiUrl('editMessageReplyMarkup',  {chat_id: chat_id, message_id: message_id, reply_markup: JSON.stringify({inline_keyboard: reply_markup}),
  }))
    if (response.status == 200) {return (await response.json()).result;
    } else {return await response.json()}
  }

  static async apiUrl (methodName, params = null) {
      let query = ''
      if (params) {query = '?' + new URLSearchParams(params).toString()}
      return `https://api.telegram.org/bot${BOT_TOKEN}/${methodName}${query}`
  }

  static async Update(event, update) {
    if (update.callback_query) {await onClick(event, update.callback_query)}
    if ('message' in update) {await onMessage(event, update.message)}
  }
}

// ------------------------------------ //
// ---------- Button Handler ---------- //
// ------------------------------------ //
 
async function onClick(event, callback) {
  const chat_id = callback.message.chat.id
  const user_id = callback.from.id
  const reply_id = callback.message.reply_to_message.message_id
  const message_id = callback.message.message_id

  if (!PUBLIC_BOT && user_id  != BOT_OWNER) {
    return await Telegram.answerCallback(callback.id, "❌ Access forbidden. Deploy your own somnium bot")
  }

  if (callback.data.startsWith("delete_")) {
    const sendby = parseInt(callback.data.split('_')[1])
    if (sendby != user_id) {return await Telegram.answerCallback(callback.id, "⚠️ Send your own query")}
    await Telegram.answerCallback(callback.id, "❌ Deleted")
    await Telegram.deleteMessage(chat_id, message_id)
    return
  }

  if (callback.data.startsWith("nav_")) {
    const index = parseInt(callback.data.split('_')[1])
    const action = callback.data.split('_')[2]
    const sendby = parseInt(callback.data.split('_')[3])
    if (sendby != user_id) {return await Telegram.answerCallback(callback.id, "⚠️ Send your own query")}
    await Telegram.answerCallback(callback.id, "✈️ Moving")
    if (action == "next") {
      const buttons = await createButton(index, "next", sendby)
      await Telegram.editMessageReplyMarkup(chat_id, message_id, buttons)
      return
    }
    if (action == "back") {
      const buttons = await createButton(index, "back", sendby)
      await Telegram.editMessageReplyMarkup(chat_id, message_id, buttons)
      return
    }
  }

  if (callback.data.startsWith("generate_")) {
    const prompt = callback.message.text.split('🫐 Dream: ')[1].split("\n\n🐈‍⬛")[0]
    const style_id = callback.data.split('_')[1]
    const sendby = callback.data.split('_')[2]
    if (sendby != user_id) {return await Telegram.answerCallback(callback.id, "⚠️ Send your own query")}
    await Telegram.answerCallback(callback.id, "💬 Processing the image")
    const style_name = (await Somnium.Styles()).styles[style_id].name
    const image = await Somnium.Generate(prompt, style_id)

    if (image.status == 200) {
      const caption = `*🫐 Dream:* \`${prompt}\`\n*🐈‍⬛ Style:* \`${style_name}\``
      const buttons = [[{ text: "Source Code", url: "https://github.com/vauth/somnium" }]];
      return await Telegram.sendDocument(chat_id, image.image, reply_id, buttons, caption)
    } else {
      await Telegram.sendMessage(chat_id, `❌ *${image.text}*`, reply_id)
    }
  }
}

// ------------------------------------- //
// ---------- Message Handler ---------- //
// ------------------------------------ //

async function onMessage(event, message) {
  const chat_id = message.chat.id
  const user_id = message.from.id
  const user_fn = message.from.first_name
  const message_id = message.message_id

  if (message.text && message.text.startsWith("/start")) {
    if (!PUBLIC_BOT && user_id != BOT_OWNER) {return await Unauthorized(chat_id, message_id)}
    const text = `Hi [${user_fn}](tg://user?id=${user_id}) [‍](https://telegra.ph/file/64d470dfb6f5c386e53c2.jpg)!\nCreate beautiful artwork using the *power of AI*. Enter a prompt, pick an art style and watch Somnium turn your dream into an AI-powered painting in seconds.`
    const buttons = [[{ text: "Source Code", url: "https://github.com/vauth/somnium" }]];
    return await Telegram.sendMessage(chat_id, text, message_id, buttons)
  }

  if (message.text && message.text.startsWith("/generate")) {
    if (!PUBLIC_BOT && user_id != BOT_OWNER) {return await Unauthorized(chat_id, message_id)}
    const prompt = message.text.split('/generate ').slice(1).join('')
    if (prompt == "") {return await Telegram.sendMessage(chat_id, "*⚠️ Please Give Me A Prompt.*", message_id)}
    const buttons = await createButton(0, "none", user_id)
    const text = `*🫐 Dream: * \`${prompt}\`\n\n*🐈‍⬛ Choose The Style:*`
    return await Telegram.sendMessage(message.chat.id, text, message.message_id, buttons)
  } else {
    if (message.chat.id.toString().includes("-100")) {return}
    if (!PUBLIC_BOT && user_id != BOT_OWNER) {return await Unauthorized(chat_id, message_id)}
    const prompt = message.text
    const buttons = await createButton(0, "none", user_id)
    const text = `*🫐 Dream: * \`${prompt}\`\n\n*🐈‍⬛ Choose The Style:*`
    return await Telegram.sendMessage(message.chat.id, text, message.message_id, buttons)
  }
}

// ------------------------------------- //
// -------- Unauthorized Creator ------- // 
// ------------------------------------- //

async function Unauthorized(chat_id, message_id) {
  const buttons = [[{ text: "Source Code", url: "https://github.com/vauth/somnium" }]];
  return Telegram.sendMessage(chat_id, "*❌ Access forbidden.*\n📡 Deploy your own [somnium](https://github.com/vauth/somnium) bot.", message_id, buttons)
}

// ------------------------------------ //
// ---------- Button Creator ---------- //
// ------------------------------------ //

async function createButton(index=0, action="none", user_id) {
  let w = 2; let h = 9;
  const buttons = []; let row = [];
  const styles = (await Somnium.Styles()).styles;
  const styleEntries = Object.entries(styles);

  if (action == "next") {
    index = index+(w*h);
    if (index >= styleEntries.length -1) {index=0};
  }
  if (action == "back") {
    index = index-(w*h);
    if (index < 0) {index=styleEntries.length - 1 - w};
  }

  for (let i = styleEntries.length - index - 1; i >= 0; i--) {
    const [id, style] = styleEntries[i];
    row.push({ text: style.name, callback_data: `generate_${id}_${user_id}` });
    if (row.length === 2) {buttons.push(row); row = []}
    if (buttons.length === 9) {break}
  }

  if (row.length > 0) {buttons.push(row)};

  buttons.push([
    { text: "❮❮", callback_data: `nav_${index}_back_${user_id}` },
    { text: "❌", callback_data: `delete_${user_id}` },
    { text: "❯❯", callback_data: `nav_${index}_next_${user_id}` }
  ]);

  return buttons;
}
