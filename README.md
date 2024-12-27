<h1>
   Somnium
  <a href="#Gif"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Milky%20Way.png" width="25px"></a>
   Worker
</h1>
<p>Create your own Somnium AI Art Generator using cloudflare workers.</p>

<br>

## 🗂 Variables
```javascript
const BOT_TOKEN = "BOT_TOKEN"; // Insert your bot token.
const BOT_WEBHOOK = "/endpoint"; // Let it be as it is.
const BOT_SECRET = "BOT_SECRET"; // Insert a powerful secret text (only [A-Z, a-z, 0-9, _, -] are allowed).
const BOT_OWNER = 123456789; // Insert your telegram account id.
const PUBLIC_BOT = false; // Make your bot public (only [true, false] are allowed).
```

### Setup:
- Get `BOT_TOKEN` from [@botfather](https://t.me/botfather).
- Change `BOT_WEBHOOK` with your preferred webhook.
- Change `BOT_SECRET` with a powerful secret text (only `[A-Z, a-z, 0-9, _, -]` are allowed).
- Get `BOT_OWNER` from [@idbot](https://t.me/username_to_id_bot).
- Change `PUBLIC_BOT` to make your bot public (only `[true, false]` are allowed).

<br>

## ⚙️Deploy
- Create a [Cloudflare](https://www.cloudflare.com/) **account**.
- Navigate to `Workers & Pages > Create > Create Worker`.
- Deploy the worker by clicking **Deploy**.
- Edit the code by clicking **Edit Code**.
- Upload `worker.js` into **Cloudflare**.
- Modify the [variables](#-variables).
- Finally, **Deploy**.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vauth/somnium)
### Setup:
- Once you deployed the bot on Cloudflare.
- Check `XXX.XXXX.workers.dev/getMe` to verify your bot authorization.
- Open `XXX.XXXX.workers.dev/registerWebhook` to register your bot webhook.
- Then you can start using your bot.

<br>

## 📦 Python Package ([pypi.org](https://pypi.org/project/somnium/))
### Installation:
```bash
python3 -m pip install somnium
```
### Usage:
```python
if __name__ == "__main__":
   from somnium import Somnium

    # Get Styles (url)
    print(Somnium.StylesGraph())

    # Get Styles (list)
    print(Somnium.Styles())

    # Generate Artwork
    print(Somnium.Generate('Hunter Schafer', 2009))
```

<br>

## 🛠 Credits
Special thanks to [Zarox](https://github.com/Zar0x) for integrating somnium to cloudflare.

<br>

## 🔗 Contributing
Contributions are welcome! Feel free to submit a pull request or report an issue.

<br>

## 🔎 License
```
MIT License

Copyright (c) 2024 Vauth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
