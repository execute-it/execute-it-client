function SoundMeter(context) {
    this.context = context
    this.volume = 0.0;
    this.slow_volume = 0.0;
    this.clip = 0.0;
    this.script = context.createScriptProcessor(2048, 1, 1);
    let that = this;
    this.script.onaudioprocess = function (event) {
        let input = event.inputBuffer.getChannelData(0);
        let i;
        let sum = 0.0;
        let clipCount = 0;
        for (i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
            if (Math.abs(input[i]) > 0.99) {
                clipCount += 1
            }
        }
        that.volume = Math.sqrt(sum / input.length);
        that.slow_volume = 0.95 * that.slow_volume + 0.05 * that.volume;
        that.clip = clipCount / input.length;
    }
}

SoundMeter.prototype.connectToSource = function (stream) {
    // console.log('SoundMeter connecting');
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // Necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
}

SoundMeter.prototype.stop = function () {
    this.mic.disconnect();
    this.script.disconnect();
}

export default SoundMeter