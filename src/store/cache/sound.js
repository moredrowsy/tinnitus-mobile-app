import { Audio } from 'expo-av';
import {
  toGain, // Covert decibels to linear factor
} from 'decibels';

export class Sound {
  constructor() {
    this.player = new Audio.Sound();
    this.state = 'stopped';
  }

  load(url) {
    return new Promise((resolve, reject) => {
      this.player
        .loadAsync({
          uri: url,
        })
        .then(resolve)
        .catch(reject);
    });
  }

  loadLocalFile(file) {
    return new Promise((resolve, reject) => {
      this.player.loadAsync(file).then(resolve).catch(reject);
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.player
        .playAsync()
        .then(() => {
          this.player
            .setIsLoopingAsync(true)
            .then(() => {
              this.state = 'started';
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.player
        .stopAsync()
        .then(() => {
          this.state = 'stopped';
          resolve();
        })
        .catch(reject);
    });
  }

  setLoop(isLoop) {
    return new Promise((resolve, reject) => {
      this.player.setIsLoopingAsync(isLoop).then(resolve).catch(reject);
    });
  }

  /**
   * Changes volume using decibels
   * Expo Audio.Sound uses range of 0 to 1, so convert decibels to linear factor
   * @param {Number} volume The volume must be in decibles of -80 to 0
   * @return {undefined}
   */
  setVolume(volume) {
    return new Promise((resolve, reject) => {
      this.player
        .setVolumeAsync(toGain(Number(volume)))
        .then(resolve)
        .catch(reject);
    });
  }
}
