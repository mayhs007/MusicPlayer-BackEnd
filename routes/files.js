const express = require('express');
const router = express.Router();
var mp3Duration = require('mp3-duration');
var fs = require('fs');
var path = require('path');
const NodeID3 = require('node-id3');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const ffmpeg = require('fluent-ffmpeg');
const probe = require('ffmpeg-probe');
var encoding = "utf8";
router.get('/getFiles', (req, res) => {

    var dirTree = ('E:\MUSIC\\Tamil\\Vantha-Rajavathaan-Varuven');
    //console.log(dirTree);
    const path2 = "./music.json";
    if (fs.existsSync(path2)) {
        //console.log("Working");
        var contents = fs.readFileSync('music.json', 'utf8');
        res.send(contents);
    } else {
        var diretoryTreeToObj = function(dir, done) {
            var results = [];
            var trackNumber = 0;
            fs.readdir(dir, function(err, list) {
                if (err)
                    return done(err);

                var pending = list.length;
                if (!pending)
                    return done(null, { name: path.basename(dir), type: 'folder', children: results });

                list.forEach(function(file) {
                    file = path.resolve(dir, file);
                    fs.stat(file, function(err, stat) {
                        if (stat && stat.isDirectory()) {
                            diretoryTreeToObj(file, function(err, data) {
                                results.push({
                                    name: path.basename(file),
                                    type: 'folder',
                                    children: data
                                });
                                if (!--pending)
                                    done(null, results);
                            });
                        } else {

                            mp3Duration(file, function(err, duration) {
                                duration = duration / 60;
                                results.push({
                                    type: path.parse(file).ext,
                                    file: path.basename(file),
                                    name: path.parse(file).name,
                                    duration: duration.toFixed(2),
                                    trackNumber: trackNumber++
                                });
                                if (!--pending)
                                    done(null, results);
                            });
                        }
                    });
                });
            });
        };
        diretoryTreeToObj(dirTree, function(err, data) {
            if (err)
                console.error(err);
            var data = JSON.stringify(data);
            fs.writeFile('music.json', data, encoding, (err) => {
                if (err) throw err;
                console.log("The file was succesfully saved!");
            });
            res.send(data);

        });
    }

});
module.exports = router;