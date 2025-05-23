import { useEffect } from "react";

export function AudioInteraction({ onTranscription, modelRef }) {
  useEffect(() => {
    let mediaRecorder;
    let audioChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioChunks = [];

        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        try {
          const response = await fetch("http://localhost:8192/speech_response", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }

          const audioResponseBlob = await response.blob();

          const audioUrl = URL.createObjectURL(audioResponseBlob);
          const audio = new Audio(audioUrl);
          modelRef.current.speak(audioUrl);
          //audio.play();

          if (onTranscription) {
            onTranscription(""); // Adjust if backend sends text in future
          }
        } catch (err) {
          console.error("Error sending audio to speech_response:", err);
        }
      };

      const handleKeyDown = (e) => {
        if (e.code === "Space" && mediaRecorder?.state === "inactive") {
          audioChunks = [];
          mediaRecorder.start();
          console.log("Recording started");
        }
      };

      const handleKeyUp = (e) => {
        if (e.code === "Space" && mediaRecorder?.state === "recording") {
          mediaRecorder.stop();
          console.log("Recording stopped and sent");
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
        stream.getTracks().forEach((track) => track.stop());
      };
    });
  }, [onTranscription, modelRef]);

  return null;
}
