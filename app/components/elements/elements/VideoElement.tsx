import React from "react";
import { VideoElement as VideoElementType } from "../../builder/types";

interface VideoElementProps {
  element: VideoElementType;
}

const VideoElement: React.FC<VideoElementProps> = ({ element }) => {
  const { src, autoplay, controls, loop, muted, styles } = element;

  // Detect video type (YouTube, Vimeo, or regular video)
  const getVideoComponent = () => {
    // Check if YouTube
    if (src.includes("youtube.com/embed") || src.includes("youtu.be")) {
      const embedUrl = src.includes("embed")
        ? src
        : `https://www.youtube.com/embed/${
            src.split("/").pop()?.split("?")[0]
          }`;

      return (
        <div className="aspect-w-16 aspect-h-9 w-full">
          <iframe
            src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=${
              autoplay ? 1 : 0
            }&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${
              muted ? 1 : 0
            }`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded"
            style={styles}
          ></iframe>
        </div>
      );
    }

    // Check if Vimeo
    if (src.includes("vimeo.com")) {
      const vimeoId = src.split("/").pop();
      return (
        <div className="aspect-w-16 aspect-h-9 w-full">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${
              autoplay ? 1 : 0
            }&loop=${loop ? 1 : 0}&muted=${muted ? 1 : 0}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded"
            style={styles}
          ></iframe>
        </div>
      );
    }

    // Regular video
    return (
      <video
        src={src}
        controls={controls}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        className="w-full rounded"
        style={styles}
      />
    );
  };

  return <div className="w-full">{getVideoComponent()}</div>;
};

export default VideoElement;
