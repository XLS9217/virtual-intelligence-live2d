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

    const handleKeyDown = (e) => {
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <canvas id="canvas" />;
}

export default App;
