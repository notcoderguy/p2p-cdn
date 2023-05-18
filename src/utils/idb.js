import { openDB } from 'idb';

// Create a new database for assets
const dbPromise = openDB('p2p-cdn', 1, {
    upgrade(db) {
        // Create a store for audio files
        const audioStore = db.createObjectStore('audio', { keyPath: 'id', autoIncrement: true });
        audioStore.createIndex('name', 'name', { unique: true });
        audioStore.createIndex('content', 'content');
        audioStore.createIndex('hash', 'hash');

        // Create a store for video files
        const videoStore = db.createObjectStore('video', { keyPath: 'id', autoIncrement: true });
        videoStore.createIndex('name', 'name', { unique: true });
        videoStore.createIndex('content', 'content');
        videoStore.createIndex('hash', 'hash');

        // Create a store for image files
        const imageStore = db.createObjectStore('image', { keyPath: 'id', autoIncrement: true });
        imageStore.createIndex('name', 'name', { unique: true });
        imageStore.createIndex('content', 'content');
        imageStore.createIndex('hash', 'hash');

        // Create a store for other files
        const fileStore = db.createObjectStore('file', { keyPath: 'id', autoIncrement: true });
        fileStore.createIndex('name', 'name', { unique: true });
        fileStore.createIndex('content', 'content');
        fileStore.createIndex('hash', 'hash');
    },
});

// Save an asset
async function saveAsset(storeName, fileName, file, hash) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const id = await store.add({ name: fileName, content: file, hash: hash });
    return id;
}

// Save an audio file
async function saveAudioFile(fileName, file, hash) {
    return saveAsset('audio', fileName, file, hash);
}

// Save a video file
async function saveVideoFile(fileName, file, hash) {
    return saveAsset('video', fileName, file, hash);
}

// Save an image file
async function saveImageFile(fileName, file, hash) {
    return saveAsset('image', fileName, file, hash);
}

// Save a file
async function saveFile(fileName, file, hash) {
    return saveAsset('file', fileName, file, hash);
}

// Retrieve an asset by name from a specific store
async function getAssetByName(storeName, fileName) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('name');
    const match = await index.get(fileName);
    return { content: match.content, hash: match.hash };
}

// Retrieve an audio file by name
async function getAudioFileByName(fileName) {
    return getAssetByName('audio', fileName);
}

// Retrieve a video file by name
async function getVideoFileByName(fileName) {
    return getAssetByName('video', fileName);
}

// Retrieve an image file by name
async function getImageFileByName(fileName) {
    return getAssetByName('image', fileName);
}

// Retrieve a file by name
async function getFileByName(fileName) {
    return getAssetByName('file', fileName);
}

// Check if an asset exists by name
async function assetExistsByName(storeName, fileName) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('name');
    const match = await index.get(fileName);
    if (match === undefined) {
        console.log(`File ${fileName} does not exist in cache.`);
    } else {
        console.log(`File ${fileName} exists in cache.`);
    }
    return match !== undefined;
}

// Check if an audio file exists by name
async function audioFileExistsByName(fileName) {
    return assetExistsByName('audio', fileName);
}

// Check if a video file exists by name
async function videoFileExistsByName(fileName) {
    return assetExistsByName('video', fileName);
}

// Check if an image file exists by name
async function imageFileExistsByName(fileName) {
    return assetExistsByName('image', fileName);
}

// Check if a file exists by name
async function fileExistsByName(fileName) {
    return assetExistsByName('file', fileName);
}

// Get asset hash by name
async function getAssetHashByName(storeName, fileName) {
    const db = await dbPromise;
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('name');
    const match = await index.get(fileName);
    return match.hash;
}

// Get audio file hash by name
async function getAudioFileHashByName(fileName) {
    return getAssetHashByName('audio', fileName);
}

// Get video file hash by name
async function getVideoFileHashByName(fileName) {
    return getAssetHashByName('video', fileName);
}

// Get image file hash by name
async function getImageFileHashByName(fileName) {
    return getAssetHashByName('image', fileName);
}

// Get file hash by name
async function getFileHashByName(fileName) {
    return getAssetHashByName('file', fileName);
}

// Export functions
export {
    saveAudioFile,
    saveVideoFile,
    saveImageFile,
    saveFile,
    getAudioFileByName,
    getVideoFileByName,
    getImageFileByName,
    getFileByName,
    audioFileExistsByName,
    videoFileExistsByName,
    imageFileExistsByName,
    fileExistsByName,
    getAudioFileHashByName,
    getVideoFileHashByName,
    getImageFileHashByName,
    getFileHashByName,
};
