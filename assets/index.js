$(document).ready(function () {


    var droppedFiles = false;
    var fileName = '';
    var $dropzone = $('.dropzone');
    var $button = $('.upload-btn');
    var uploading = false;
    var $syncing = $('.syncing');
    var $done = $('.done');
    var $bar = $('.bar');
    var timeOut;

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
    }



    function getSrc(block) {
        if (block.cell_type == "code") {
            block.source.forEach((code) => {
                document.getElementById("temp").textContent += "\n" + code;
                console.log("\n" + code);
            })
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



    if (window.FileList && window.File && window.FileReader) {
        const selector = document.getElementById('submit-button').addEventListener('click', () => {
            startUpload();
            const file = document.getElementById('file-selector').files[0];

            if (!file.name) {
                alert('Error: The File.name property does not appear to be supported on this browser.');
                return;
            }
            if (!file.name.match('.*\.ipynb')) {
                alert('Error: The selected file does not appear to be an JypyterNotebook.');
                return;
            }

            const reader = new FileReader();
            reader.addEventListener('load', event => {

                const json = event.target.result;
                const obj = JSON.parse(json);
                var allCode = obj.cells.forEach(getSrc);
                var codeType = file.name.substring(0, file.name.length - 6) + obj.metadata.language_info.file_extension.toString()
                download(codeType, document.getElementById("temp").textContent);
                document.getElementById("temp").textContent = "";
            });
            reader.readAsText(file);
        });
    } 
});