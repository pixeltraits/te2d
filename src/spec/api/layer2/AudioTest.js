import Audio from '../../../api/layer2/Audio.js';

describe('Audio', function () {

    var audio,
        audioContext = new window.AudioContext;

    beforeEach(function () {
        audio = new Audio();
    });

    describe('constructor', function () {

        it('should generate an Audio object', function() {
            // Given
            var active = false,
                pause = false,
                pannerNode = null,
                source = null,
                audioObject;

            // When
            audioObject = new Audio();

            // Then
            expect(audioObject.pause).toEqual(pause);
            expect(audioObject.active).toEqual(active);
            expect(audioObject.pannerNode).toEqual(pannerNode);
            expect(audioObject.source).toEqual(source);
        });

    });

    describe('setAudio', function () {

        it('should set and start audio', function(done) {
            // Given
            var audioProfil = {
              	"name": "audioTest",
              	"audio": {},
              	"loop": false,
              	"nLoop": 0
              },
              xhr = new XMLHttpRequest();

            xhr.open("GET", "/base/spec/api/layer2/ressources/audio/audioTest.mp3", true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
              audioContext.decodeAudioData(xhr.response, function(buffer) {
                audioProfil.audio = buffer;

                // When
                audio.setAudio(audioProfil, audioContext);

                // Then
                expect(audio.source.onended.toString().replace(/\s/g, '')).toEqual("function(){self.active=false;}");
                expect(audio.active).toEqual(true);
                expect(audio.source.loop).toEqual(audioProfil.loop);
                expect(audio.source.buffer).toEqual(buffer);
                expect(audio.pannerNode).toEqual(audioContext.createPanner());

                done();
              });
            }
            xhr.send();
        });

    });

    describe('unsetAudio', function () {

        it('should unset and stop audio', function(done) {
            // Given
            var audioProfil = {
              	"name": "audioTest",
              	"audio": {},
              	"loop": false,
              	"nLoop": 0
              },
              sourceLoop = false,
              active = false,
              xhr = new XMLHttpRequest();

            xhr.open("GET", "/base/spec/api/layer2/ressources/audio/audioTest.mp3", true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function() {
              audioContext.decodeAudioData(xhr.response, function(buffer) {
                audioProfil.audio = buffer;
                audio.setAudio(audioProfil, audioContext);

                // When
                audio.unsetAudio();

                // Then
                expect(audio.active).toEqual(active);
                expect(audio.source.loop).toEqual(sourceLoop);

                done();
              });
            }
            xhr.send();
        });

    });

});
