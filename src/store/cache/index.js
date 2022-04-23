// React Native
import {
  checkFileExists,
  deleteDir,
  ensureDirExists,
  getDirUri,
  getFileUri,
  readStringFromLocalAsync,
  writeStringToLocalAsync,
} from '../localFS';
import { Sound } from './sound';
import { seqFiles } from './sequences';
import { toneFiles } from './tones';

// Redux
import { updateMix, updateMixStatus } from '../redux/slices/mixes';
import { setNoise, updateNoiseVolume } from '../redux/slices/noises';
import {
  getSoundFileAsync,
  getSoundFilesAsync,
} from '../redux/slices/soundFiles';
import {
  updateSound,
  updateSoundStatus,
  updateSoundVolume,
} from '../redux/slices/sounds';
import {
  updateNoiseVolumeAsync,
  updateUserMixTrackVolumeAsync,
  updateUserSoundVolumeAsync,
} from '../redux/slices/user';

import { ACRN, DEBOUNCE_WAIT, VOLUME } from '../../constants';
import { debounce } from '../../utils';
import { setAcrn } from '../redux/slices/acrns';

export const soundCache = {};

const changeNoiseVolumeDebounce = debounce(
  ({ color, dispatch, userId, volume }) => {
    try {
      dispatch(updateNoiseVolume({ color, volume }));
      dispatch(
        updateNoiseVolumeAsync({
          color,
          userId,
          volume,
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export async function changeNoiseVolume({ color, dispatch, userId, volume }) {
  if (soundCache.hasOwnProperty(color)) {
    const { player } = soundCache[color];
    player.setVolume(volume);
  }
  changeNoiseVolumeDebounce({ color, dispatch, userId, volume });
}

export async function toggleNoise({ color, dispatch, volume }) {
  const { player } = soundCache[color];
  if (player.state === 'started') {
    await player.stop();
  } else {
    await player.setVolume(volume);
    await player.start();
  }
  dispatch(setNoise({ noise: { color, status: player.state } }));
}

export async function toggleSound({ dispatch, id, storageKey, volume }) {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];
    await player.setVolume(volume);

    if (player.state === 'started') {
      await player.stop();
      dispatch(updateSoundStatus({ id, status: 'stopped' }));
    } else {
      await player.start();
      dispatch(updateSoundStatus({ id, status: 'started' }));
    }
  }
}

export async function toggleSoundFile({ dispatch, id, storageKey, volume }) {
  // React Native
  // Check sound file by id exists in local directory
  const fileUri = getFileUri('sounds', id);
  const fileExists = await checkFileExists(fileUri);

  // Check if there is a sound player in storage
  if (soundCache.hasOwnProperty(storageKey)) {
    toggleSound({ dispatch, id, storageKey, volume });
  }
  // If file exists locally as data string, then load it
  else if (fileExists) {
    // Set status to downloading from local
    dispatch(updateSoundStatus({ id, status: 'downloading' }));

    // Read dataURL from local file
    const dataURL = await readStringFromLocalAsync(fileUri);

    // Create new player and load dataURL
    const player = new Sound();
    await player.load(dataURL);

    // Set status to complete from local
    dispatch(updateSoundStatus({ id, status: 'complete' }));

    // Add to cache
    soundCache[storageKey] = { player };

    // Start player
    await player.setLoop(true);
    await player.setVolume(volume);
    await player.start();

    // Update redux
    dispatch(
      updateSound({
        id,
        sound: { status: 'started', volume: VOLUME.default },
      })
    );
  }
  // No sound player, need to dl and load file to new player
  else {
    const onSuccess = async (dataURL) => {
      try {
        // React Native
        // Save dataURL locally
        const soundsDir = getDirUri('sounds');
        await ensureDirExists(soundsDir);
        const soundFileURI = getFileUri('sounds', id);
        await writeStringToLocalAsync(soundFileURI, dataURL);

        // Create new player and add to cache
        const player = new Sound();
        await player.load(dataURL);
        soundCache[storageKey] = { player };

        // Start player
        await player.setLoop(true);
        await player.setVolume(volume);
        await player.start();
      } catch (e) {
        console.log(e);
      }

      // Update redux
      dispatch(
        updateSound({
          id,
          sound: { status: 'started', volume: VOLUME.default },
        })
      );
    };
    dispatch(getSoundFileAsync({ id, storageKey, onSuccess }));
  }
}

const changeSoundVolumeDebounce = debounce(
  ({ dispatch, soundId, userId, volume }) => {
    try {
      dispatch(updateSoundVolume({ id: soundId, volume }));
      dispatch(
        updateUserSoundVolumeAsync({
          userId,
          soundId,
          volume,
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export function changeSoundVolume({
  dispatch,
  soundId,
  storageKey,
  userId,
  volume,
}) {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];
    player.setVolume(volume);
  }

  changeSoundVolumeDebounce({ dispatch, soundId, userId, volume });
}

export const addPlayer = async ({ storageKey, dataURL, volume }) => {
  if (soundCache.hasOwnProperty(storageKey)) {
    soundCache[storageKey].player.stop();
    delete soundCache[storageKey];
  }

  try {
    // Create new player and add to cache
    const player = new Sound();
    await player.load(dataURL);
    soundCache[storageKey] = { player };
  } catch (e) {
    console.log(e);
  }
};

export const stopPlayer = ({ dispatch, id, storageKey }) => {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];

    player.stop();
    dispatch(updateSoundStatus({ id, status: 'stopped' }));
  }
};

export function toggleMix({ dispatch, mix, soundList, userMix }) {
  if (mix.status === 'started') {
    for (const sound of soundList) {
      const { id, storagePath: storageKey } = sound;

      stopPlayer({ dispatch, id, storageKey });
    }
    dispatch(updateMixStatus({ id: mix.id, status: 'stopped' }));
  } else {
    dispatch(updateMixStatus({ id: mix.id, status: 'downloading' }));

    const onSuccess = async (datas) => {
      // Build temporary player storage
      for (const data of datas) {
        const { storageKey, dataURL } = data;
        // Create player
        try {
          const player = new Sound();
          await player.load(dataURL);
          await player.setLoop(true);
          soundCache[storageKey] = { player };
        } catch (e) {
          console.log(e);
        }
      }

      // started player files
      for (const sound of soundList) {
        const { id, storagePath: storageKey } = sound;

        let mixVolumes = {};
        // Check if there is mixVolumes for each track by user
        if (userMix) {
          mixVolumes = userMix.mixVolumes;
        }

        if (soundCache.hasOwnProperty(storageKey)) {
          const { player } = soundCache[storageKey];

          // Adjust sound volume from user's mixVolumes
          if (mixVolumes.hasOwnProperty(sound.id)) {
            const volume = mixVolumes[sound.id];

            await player.setVolume(volume);
            await player.start();
          }

          dispatch(
            updateSound({
              id,
              sound: { status: 'started', volume: VOLUME.default },
            })
          );
        }
      }

      dispatch(
        updateMix({
          id: mix.id,
          mix: { status: 'started', volume: VOLUME.default },
        })
      );
    };
    dispatch(getSoundFilesAsync({ sounds: soundList, onSuccess }));
  }
}

const changeMixSoundVolumeDebounce = debounce(
  ({ dispatch, mixId, soundId, userId, volume }) => {
    try {
      dispatch(updateSoundVolume({ id: soundId, volume }));
      dispatch(
        updateUserMixTrackVolumeAsync({
          mixId,
          soundId,
          userId,
          volume,
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export async function changeMixSoundVolume({
  dispatch,
  mixId,
  soundId,
  storageKey,
  userId,
  volume,
}) {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];
    player.setVolume(volume);
  }

  changeMixSoundVolumeDebounce({ dispatch, mixId, soundId, userId, volume });
}

export const toggleAcrnPlay = async ({
  acrns,
  dispatch,
  frequency,
  type,
  volume,
}) => {
  let player;
  let status = acrns[type].status;
  const key = `${type}-${frequency}`;

  // Check if exists
  if (type === ACRN.type.tone) {
    if (!soundCache.hasOwnProperty(key)) {
      const file = toneFiles[frequency];
      player = new Sound();
      await player.loadLocalFile(file);
      soundCache[key] = { player };
    } else {
      player = soundCache[key].player;
    }
  } else {
    if (!soundCache.hasOwnProperty(key)) {
      const file = seqFiles[frequency];
      player = new Sound();
      await player.loadLocalFile(file);
      soundCache[key] = { player };
    } else {
      player = soundCache[key].player;
    }
  }

  if (status === 'stopped') {
    await player.setLoop(true);
    await player.setVolume(volume);
    await player.start();
    status = 'started';
  } else {
    await player.stop();
    status = 'stopped';
  }

  dispatch(setAcrn({ type, acrn: { status } }));
};

export const acrnVolChange = ({ frequency, type, volume }) => {
  const key = `${type}-${frequency}`;

  // Check if tone exists
  if (soundCache.hasOwnProperty(key)) {
    const { player } = soundCache[key];
    player.setVolume(volume);
  }
};
