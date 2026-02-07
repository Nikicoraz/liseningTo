$(document).ready(function() {
    function fetchNowPlaying() {
        $.ajax({
            url: 'https://kernelkitty.it:2053/now-playing', 
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // parse artist and song from data.nowPlaying (expected format: "Artist - Song")
                var artist = null, song = null;
                if (data.nowPlaying && data.nowPlaying !== 'No music currently playing') {
                    var parts = data.nowPlaying.split(' - ');
                    artist = parts.shift().trim();
                    song = parts.join(' - ').trim(); // join remaining parts in case the song contains ' - '

                    var nowPlayingTitle = `<a href="${data.url}" target="_blank">${song}</a>`;
                    var nowPlayingArtist = `<a href="${data.url.split('_/')[0]}" target="_blank">${artist}</a>`;
                } else {
                    var nowPlayingTitle = data.nowPlaying || 'No music currently playing';
                    var nowPlayingArtist = data.nowPlaying || 'No music currently playing';
                }

                fetchImage(artist, song);
                $('#nowPlayingTitle').html(nowPlayingTitle);
                $('#nowPlayingArtist').html(nowPlayingArtist);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }

    function fetchImage(artist, song) {
        $.ajax({
            url: `https://kernelkitty.it:2053/getImage?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`, 
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.image && data.error !== 'Internal Server Error Last Fm') {
                    $('.cover').attr('src', data.image);
                } else {
                    $('.cover').attr('src', './placeholder.png'); // Fallback image
                }
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }

    fetchNowPlaying();
    setInterval(fetchNowPlaying, 5000); // Fetch every 5 seconds, the api is limited to 20 seconds tho
});
