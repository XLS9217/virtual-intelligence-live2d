import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';
import { AudioInteraction } from "./AudioInteraction";

window.PIXI = PIXI;

Live2DModel.registerTicker(PIXI.Ticker);

function App() {
  const modelRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      view: document.getElementById("canvas"),
      autoStart: true,
      resizeTo: window
    });

    Live2DModel.from(
      // "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json"
      "kei_en/kei_basic_free/runtime/kei_basic_free.model3.json"
    ).then((model) => {
      app.stage.addChild(model);

      model.anchor.set(0.5, 0.5);
      model.position.set(window.innerWidth / 2, window.innerHeight / 2);
      model.scale.set(0.1, 0.1);

      modelRef.current = model;

      model.on("hit", () => {
        model.expression("f05");
      });
    });

    const handleKeyDown = async (e) => {
      const model = modelRef.current;
      if (!model) return;

      if (e.key.toLowerCase() === 'q') {
        model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", 1);
      } else if (e.key.toLowerCase() === 'e') {
        model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", 0);
      } else if (e.key.toLowerCase() === 'g') {
        model.speak("./aud.wav")
      }





      //------------------test
       else if (e.key.toLowerCase() === 'a') {

        console.log("fetching ")
        fetch("http://localhost:8192/llm_process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: " hello how do I use react" }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.error("Error:", err);
          });
      }

      else if (e.key.toLowerCase() === 'd') {

        console.log("fetching ")
        fetch("http://localhost:8192/tts_speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: " hello how do I use react" }),
        })
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.blob(); // get response as blob (audio file)
        })
        .then(blob => {
          console.log("Audio blob received", blob);
          // Create a URL and play audio
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.play();
        })
        .catch(err => {
          console.error("Error:", err);
        });

      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>
    <canvas id="canvas" />
    <AudioInteraction modelRef = {modelRef}/>
  </>;
}

export default App;
