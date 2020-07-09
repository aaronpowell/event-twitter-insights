import React, { useState, useEffect } from "react";
import { TagCloud } from "react-tagcloud";
import "./App.css";

type KeyPhraseResult = {
  [key: string]: number;
};

type TagCloudData = {
  count: number;
  value: string;
}[];

function App() {
  const [phrases, setPhrases] = useState<TagCloudData>();

  useEffect(() => {
    const loadData = async () => {
      const result = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? window.location.href.replace("3000", "7071")
            : "/"
        }api/GetKeyPhrases`
      );
      const json: KeyPhraseResult = await result.json();

      setPhrases(
        Object.keys(json).map((key) => {
          return { value: key, count: json[key] };
        })
      );
    };

    loadData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!phrases && <p>Just fetching data, please wait</p>}
        {phrases && <TagCloud minSize={12} maxSize={35} tags={phrases} />}
      </header>
    </div>
  );
}

export default App;
