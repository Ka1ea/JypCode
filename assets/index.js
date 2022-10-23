const output = document.getElementById('output');

function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({
      file,
      name,
      type,
      size
    });
  }
}


function getSrc(block) {
  if (block.cell_type == "code") {
    block.source.forEach((code) => {
      output.innerText = "\n" + code + output.innerText;
    })
  }
}



const cStatus = document.getElementById('status');
if (window.FileList && window.File && window.FileReader) {
  document.getElementById('file-selector').addEventListener('change', event => {
    output.src = '';
    cStatus.textContent = '';
    const file = event.target.files[0];
    
		if (!file.name) {
      cStatus.textContent = 'Error: The File.name property does not appear to be supported on this browser.';
      return;
    }
    if (!file.name.match('.*\.ipynb')) {
      cStatus.textContent = 'Error: The selected file does not appear to be an JypyterNotebook.'
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', event => {
      const json = event.target.result;
      const obj = JSON.parse(json)
      obj.cells.reverse().forEach(getSrc);
    });
    reader.readAsText(file);
    getMetadataForFileList(event.target.files)
  });
} else {
    cStatus.innerText = "Error browser incompatible with application";
}
