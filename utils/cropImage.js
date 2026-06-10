export const getCroppedImg = (
  imageSrc,
  pixelCrop
) =>
  new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      image.src = imageSrc;

      image.onload = () => {
        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width =
          pixelCrop.width;

        canvas.height =
          pixelCrop.height;

        const ctx =
          canvas.getContext(
            "2d"
          );

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            0.95
          )
        );
      };

      image.onerror = reject;
    }
  );