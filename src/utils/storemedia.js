// function createDB(){
//         var request = indexedDB.open("elephantFiles", dbVersion),
//         db,
//         createObjectStore = function (dataBase) {
//             // Create an objectStore
//             console.log("Creating objectStore")
//             dataBase.createObjectStore("elephants");
//         }
// }

const audio = (file) => {
  const [files] = file.files;
  console.log(file);
  console.log(URL.createObjectURL(files));
  return URL.createObjectURL(files);
};

export { audio };
