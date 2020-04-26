import firebase from "firebase/app";
import "firebase/storage";

import fireBaseConfig from "../firebaseConfig.json";
import { fileMD5Hash, getExtension } from "./file";
import { run } from "./object";
import Logger from "./Logger";

try {
  firebase.initializeApp(fireBaseConfig);
} catch (e) {
  Logger.w(e);
}

const storage = firebase.storage();

export const storageRef = storage.ref();

export async function uploadFile(path, file, options) {
  let fileHash = await fileMD5Hash(file);

  path = `${path}/${fileHash}.${getExtension(file.name)}`;

  let uploadTask = storageRef.child(path).put(file, {
    contentType: file.type,
    md5Hash: fileHash,
    customMetadata: {},
  });

  uploadTask.on(
    "state_changed",
    function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      run(options, "onProgress", progress);

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          run(options, "onPause");
          break;
        case firebase.storage.TaskState.RUNNING:
          run(options, "onRunning");
          break;
      }
    },
    function(error) {
      run(options, "onFailed", error);
    },
    function() {
      run(options, "onComplete", path);
    }
  );

  return uploadTask;
}

export function getDownloadPath(path) {
  return storage.ref(path).getDownloadURL();
}

export function deleteFile(...files) {
  return Promise.all(
    files.map(
      (path) =>
        path &&
        new Promise((res, rej) => {
          var desertRef = storageRef.child(path);

          // Delete the file
          desertRef
            .delete()
            .then(function() {
              res();
            })
            .catch(function(error) {
              rej(error);
            });
        })
    )
  );
}

export default storage;
