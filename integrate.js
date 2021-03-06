/*
 * Copyright 2016 Kristian Holsheimer <kristian.holsheimer@gmail.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

(function(Nuvola)
{

// Create media player component
var player = Nuvola.$object(Nuvola.MediaPlayer);

// Handy aliases
var PlaybackState = Nuvola.PlaybackState;
var PlayerAction = Nuvola.PlayerAction;

// Create new WebApp prototype
var WebApp = Nuvola.$WebApp();

// Initialization routines
WebApp._onInitWebWorker = function(emitter)
{
    Nuvola.WebApp._onInitWebWorker.call(this, emitter);

    var state = document.readyState;
    if (state === "interactive" || state === "complete")
        this._onPageReady();
    else
        document.addEventListener("DOMContentLoaded", this._onPageReady.bind(this));
}

// Page is ready for magic
WebApp._onPageReady = function()
{
    // Connect handler for signal ActionActivated
    Nuvola.actions.connect("ActionActivated", this);

    // Start update routine
    this.update();
}

// Extract data from the web page
WebApp.update = function()
{
    // Update information about the player's current state
    try {
        var open = $('body[ng-app="pocketcasts"]').scope().isAudioPlayerOpen();
        var state = JSON.parse($('body').attr('data-unity-state'));
        var playing = state['playing'];

        // playback state
        if ( playing )
            player.setPlaybackState(PlaybackState.PLAYING);
        else
            player.setPlaybackState(PlaybackState.PAUSED);

        // track info
        player.setTrack({
            title: state['title'],
            artist: state['artist'],
            album: state['artist'],
            artLocation: state['albumArt']
        });

        // possible actions
        player.setCanPlay(open && !playing);
        player.setCanPause(open && playing);
        player.setCanGoNext(open);
        player.setCanGoPrev(open);

    } catch(e) {
        // switch to defaults
        player.setPlaybackState(PlaybackState.UNKNOWN);
        player.setCanPlay(false);
        player.setCanPause(false);
        player.setCanGoNext(false);
        player.setCanGoPrev(false);

        if ( e.message !== 'JSON Parse error: Unexpected identifier "undefined"' )
            Nuvola.log(e.message);
    }

    // Schedule the next update
    setTimeout(this.update.bind(this), 500);
}

// Handler of playback actions
WebApp._onActionActivated = function(emitter, name, param)
{
    try
    {
        var mediaPlayer = $('body[ng-app="pocketcasts"]').scope().mediaPlayer;

        switch (name)
        {
            case PlayerAction.TOGGLE_PLAY:
                mediaPlayer.playPause();
                break;
            case PlayerAction.PLAY:
                mediaPlayer.playPause();
                break;
            case PlayerAction.PAUSE:
                mediaPlayer.playPause();
                break;
            case PlayerAction.STOP:
                mediaPlayer.playPause();
                mediaPlayer.closePlayer();
                break;
            case PlayerAction.NEXT_SONG:
                mediaPlayer.jumpForward();
                break;
            case PlayerAction.PREV_SONG:
                mediaPlayer.jumpBack();
                break;
        }
    } catch(e) {
        Nuvola.log(e.message);
    }
}

WebApp.start();

})(this);  // function(Nuvola)
