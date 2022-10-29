$(document).ready(function () {


    var droppedFiles = false;
    var fileName = '';
    var $dropzone = $('.dropzone');
    var $button = $('.upload-btn');
    var uploading = false;
    var $syncing = $('.syncing');
    var $done = $('.done');
    var $bar = $('.bar');

    $dropzone.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
    })
        .on('dragover dragenter', function () {
            $dropzone.addClass('is-dragover');
        })
        .on('dragleave dragend drop', function () {
            $dropzone.removeClass('is-dragover');
        })
        .on('drop', function (e) {
            droppedFiles = e.originalEvent.dataTransfer.files;
            fileName = droppedFiles[0]['name'];
            $('.filename').html(fileName);
            $('.dropzone .upload').hide();
        });


    $("input:file").change(function () {
        fileName = $(this)[0].files[0].name;
        $('.filename').html(fileName);
        $('.dropzone .upload').hide();
    });


    function reset() {
        $('.dropzone .upload').toggle();
        $syncing.toggle();
        $done.removeClass('active');
        $bar.removeClass('active');
        $syncing.removeClass('active');
        $dropzone.fadeIn();
        $button.html('Upload');
    }

    function startUpload() {
        if (!uploading && fileName != '') {
            uploading = true;
            $button.html('Uploading...');
            $dropzone.fadeOut();
            $syncing.addClass('active');
            $done.addClass('active');
            $bar.addClass('active');
            timeoutID = window.setTimeout(showDone, 1000);
        }
    }

    function showDone() {
        $button.html('Done');
        uploading = false;
    }



    function getSrc(block) {
        if (block.cell_type == "code") {
            block.source.forEach((code) => {
                document.getElementById("temp").textContent += "\n" + code.trim();
                // console.log("\n" + code);
            })
            document.getElementById("temp").textContent += "\n";
        }
    }



    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    const git = document.getElementById("git").addEventListener('mouseover', (event) => {
        document.getElementById("git").classList.add('animate__tada');
        setTimeout(() => {
            document.getElementById("git").classList.remove("animate__tada"); 
        }, 1000);
    })



    if (window.FileList && window.File && window.FileReader) {
        var isClickable = true;
        const selector = document.getElementById('submit-button').addEventListener('click', () => {
            const button = document.getElementById("submit-button");
            if (button.textContent == 'Done') {
                reset();
                return;
            }

            if (document.getElementById('file-selector').files[0] && isClickable) {

                const file = document.getElementById('file-selector').files[0];
                
                
                if (!file.name.match('.*\.ipynb')) {
                    alert('Error: The wrong file format, please submit .ipynb files only.');
                    return;
                }
                
                const reader = new FileReader();
                reader.addEventListener('load', event => {
                    try{
                        const json = event.target.result;
                        const obj = JSON.parse(json);
                        obj.cells.forEach(getSrc);
                        var codeType = file.name.substring(0, file.name.length - 6) + obj.metadata.language_info.file_extension.toString()
                        download(codeType, document.getElementById("temp").textContent);
                        document.getElementById("temp").textContent = "";
                        startUpload();
                    } catch (err) { 
                        alert("Error while parsing. Invalid format.");
                        return;
                    }

                });
                reader.readAsText(file);

                
                button.style.background = '#5ca45c';
                button.classList.toggle('active');
                isClickable = false;
                setTimeout(function () {
                    isClickable = true;
                    button.classList.toggle('active');
                    button.style.background = '#6ECE3B';
                }, 1000);

            } else {
                button.classList.add("animate__shakeX");
                setTimeout(() => {
                    button.classList.remove("animate__shakeX"); 
                }, 1000);
            }

        });
    }
});