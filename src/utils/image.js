export default {
  compress(base64URL, callback) {
    let canvas = document.createElement("canvas"),
      drawer = canvas.getContext("2d"),
      maxWidth = 1440,
      maxHeight = 1080,
      quality = 0.9, // 压缩质量
      img = new Image();
    img.src = base64URL;
    img.onload = function () {
      if (canvas.getContext) {
        let targetWidth = img.width,
          targetHeight = img.height;
        //图片尺寸超过的限制
        //1440*1080 宽*高 
        if (targetWidth > targetHeight && (targetWidth >= maxWidth || targetHeight >= maxHeight)) {
          targetWidth = maxWidth;
          targetHeight = maxHeight;
          //1080*1440 宽*高 
        } else if (targetWidth >= maxHeight || targetHeight >= maxWidth) {
          targetWidth = maxHeight;
          targetHeight = maxWidth;
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        drawer.clearRect(0, 0, targetWidth, targetHeight);
        // drawer.fillStyle = "#fff";
        // drawer.fillRect(0, 0, canvas.width, canvas.height);
        drawer.drawImage(img, 0, 0, targetWidth, targetHeight);
        let newBase64 = canvas.toDataURL("image/jpeg", quality);
        let arr = newBase64.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        let newImgFile = new File([u8arr], Date.parse(Date()) + ".jpg", {
          type: mime
        });
        canvas = null;
        callback.call(this, newImgFile);
      } else {
        canvas = null;
        callback.call(this, null);
      }
    };
  }
}
