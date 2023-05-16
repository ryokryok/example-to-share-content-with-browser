import { useEffect, useState } from "react";
import "./styles.css";

type GenerateIntentUrlProps = Partial<{
  text: string;
  url: string;
  hashtags: string;
  via: string;
}>;

const generateIntentUrl = ({
  text,
  url,
  hashtags,
  via
}: GenerateIntentUrlProps) => {
  const _url = new URL("https://twitter.com/intent/tweet");
  text && _url.searchParams.set("text", text);
  url && _url.searchParams.set("url", url);
  hashtags && _url.searchParams.set("hashtags", hashtags);
  via && _url.searchParams.set("via", via);
  return _url.href;
};

const getFile = async () => {
  const res = await fetch(
    "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
  );
  const blob = await res.blob();
  const file = new File([blob], "dice.png", {
    type: blob.type
  });
  return file;
};

export default function App() {
  const [title, setTitle] = useState("Share Site");
  const [text, setText] = useState("Hello World");
  const [url, setUrl] = useState("https://example.com/");
  const [hashtags, setHashtags] = useState("banana,apple");
  const [via, setVia] = useState("twitterdev");
  const [shareImage, setShareImage] = useState(false);
  const [result, setResult] = useState("");

  const canShare = navigator.canShare !== undefined;

  const intentUrl = generateIntentUrl({ text, url, hashtags, via });

  const shareButtonHandler = async () => {
    try {
      const file = await getFile();
      const shareData: ShareData = shareImage
        ? { files: [file], title, text, url }
        : { title, text, url };
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setResult("success");
      } else {
        setResult("cannot share");
      }
    } catch (error) {
      setResult(`error: ${error}`);
    }
  };
  const copyButtonHandler = async () => {
    try {
      if (!shareImage) {
        await navigator.clipboard.writeText(text);
      } else {
        const file = await getFile();
        const data = [new ClipboardItem({ [file.type]: file })];
        await navigator.clipboard.write(data);
      }
      setResult("success to copy");
    } catch (error) {
      setResult(`error: ${error}`);
    }
  };

  useEffect(() => {
    try {
    } catch (error) {}
  }, []);

  return (
    <div className="App">
      <h1>Twitter Intent URL, Share API and Clipboard API</h1>
      <form action="">
        <div className="form-item">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-item">
          <label htmlFor="text">Text</label>
          <textarea
            name="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-item">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="form-item">
          <label htmlFor="hashtags">Hashtags</label>
          <input
            type="hashtags"
            name="hashtags"
            id="hashtags"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>
        <div className="form-item">
          <label htmlFor="via">Via</label>
          <input
            type="text"
            name="via"
            id="via"
            value={via}
            onChange={(e) => setVia(e.target.value)}
          />
        </div>
        <div
          className="form-item"
          style={{ flexDirection: "row", gap: "1rem" }}
        >
          <label htmlFor="shareImage">
            Share image ?(share api or clipboard)
          </label>
          <input
            type="checkbox"
            name="shareImage"
            id="shareImage"
            checked={shareImage}
            onChange={(e) => setShareImage(e.target.checked)}
          />
        </div>
        <div>
          <p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png"
              alt=""
              width={120}
              height={90}
            />
          </p>
        </div>
      </form>
      <hr />

      <div className="share-container">
        <a href={intentUrl}>{intentUrl}</a>
        <button type="button" onClick={shareButtonHandler} disabled={!canShare}>
          {canShare ? "share" : "can not share this device"}
        </button>
        <button type="button" onClick={copyButtonHandler}>
          copy to clipboard
        </button>
        <pre>{result}</pre>
      </div>
    </div>
  );
}
