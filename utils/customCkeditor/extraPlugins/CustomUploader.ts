import API_PATH from "~/enums/API_PATH";

class ImageUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  base64ToFile({ type, name }: File) {
    const base64string = this.loader._reader.data.split(",")[1];
    const formData = new FormData();
    formData.append("file", new Blob([base64string], { type }), name);
    return formData;
  }

  sendImage(file: File) {
    const image = this.base64ToFile(file);
    return useAPI({ path: API_PATH.FILE_UPLOAD })._post(image);
  }

  handlePromise(resolve: Function, reject: Function, file: File) {
    this.sendImage(file).then(({ error, data }) => {
      if (error.value) return reject(error.value);

      // fileDownloadUri is image id instead of image url,
      // wait for Loc to provide new API 30/10/2023 11:39
      const src = data.value.data.data.fileDownloadUri;
      // console.log("src: ", src);

      // resolve({
      //   default: src,
      // });

      //test resolve default
      resolve({
        default:
          "https://images.pexels.com/photos/18882456/pexels-photo-18882456/free-photo-of-suspension-bridge-in-a-forest.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
      });
    });
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then((file) => {
      return new Promise((resolve, reject) => this.handlePromise(resolve, reject, file));
    });
  }

  // Aborts the upload process.
  abort() {
    console.log("abort...");
  }
}

export default function customImageUploadAdapter(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    // Configure the URL to the upload script in your back-end here!
    return new ImageUploadAdapter(loader);
  };
}
