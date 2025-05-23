import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch';

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

      console.log("speak")

      if (e.key.toLowerCase() === 'q') {
        model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", 1);
      } else if (e.key.toLowerCase() === 'e') {
        model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", 0);
      } else if (e.key.toLowerCase() === 'g') {
        model.speak("./aud.wav")
      }
      //  else if (e.key.toLowerCase() === 'a') {

      //   console.log("fetching ")
      //   fetch("http://localhost:8192/llm_process", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ user_input: " hello how do I use react" }),
      //   })
      //     .then((res) => res.json())
      //     .then((data) => {
      //       console.log(data);
      //     })
      //     .catch((err) => {
      //       console.error("Error:", err);
      //     });
      // }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <canvas id="canvas" />;
}

export default App;
