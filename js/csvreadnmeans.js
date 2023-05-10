var ofReader = new FileReader();
var htmlTxt = '';
var gAllFiles = [];
var gFilesToRead = [];
var csvIndex = 0;
var lgCol = 1;
var ltCol = 2;
var lgMean = 0;
var ltMean = 0;
var decPrec = 4;
var csvStartingRow = 1;
var selectnDOMpath = '#divFiles2ReadMlti input:checked';

ofReader.onloadend = function () {
	var oflTxt = ofReader.result;
	var t = oflTxt.split(/\r\n|\n/);
	var lgArr = [];
	var ltArr = [];
	var s = htmlTxt;
	var lgMn = 0;
	var ltMn = 0;
	lgArr = [];
	ltArr = [];
	s += `File: <b>${gFilesToRead[csvIndex].name}</b> \n`;
	s += `Long \t\t | Lat` + "\n";
	for (let i = csvStartingRow; i < t.length - 1; i++) {
		const ln = t[i];
		const d = ln.split(',');
		const lg = d[lgCol].trim();
		const lt = d[ltCol].trim();
		lgArr.push(lg);
		ltArr.push(lt);
		s += `${lg} \t\t | ${lt} \n`;
	}

	lgMn += (eval(lgArr.join('+')) / lgArr.length);
	ltMn += (eval(ltArr.join('+')) / ltArr.length);
	lgMean = (lgMean == 0) ? lgMn : ((lgMean + lgMn) / 2);
	ltMean = (ltMean == 0) ? ltMn : ((ltMean + ltMn) / 2);

	s += `──── Mean(s): ───── \n`;
	s += `<b>${(lgMean).toFixed(decPrec)} \t\t ${ltMean.toFixed(decPrec)} </b> \n\n`;

	htmlTxt = s;

	$('.fl-misc-global op').html(s);
	refreshDisplayEls();
	csvIndex++;
	readSingleCSV(csvIndex);
};

function readSingleCSV(csvIndex) {
	if (csvIndex >= gFilesToRead.length) return;
	ofReader.readAsBinaryString(gFilesToRead[csvIndex]);
}

function readCSVs(theFileIndexes) {
	htmlTxt = '';
	lgMean = 0;
	ltMean = 0;
	gFilesToRead = theFileIndexes;
	csvIndex = 0;
	readSingleCSV(0);
}

function gAddFiles(fls) {
	for (const fl of fls) { gAllFiles.push(fl); }
	readCSVs(gAllFiles);
	sessionStorage.setItem('gAllFiles', JSON.stringify(gAllFiles));
}

function removeFileWithIndex(idx) {
	let file = gAllFiles[idx];
	gAllFiles.splice(idx, 1);
	const idxInFls2Rd = gFilesToRead.indexOf(file);
	if (idxInFls2Rd >= 0) {
		gFilesToRead.splice(idxInFls2Rd, 1);
	}
}

function getCbxSelectedFiles() {
	var elms = document.querySelectorAll(selectnDOMpath);
	var values = Array.prototype.slice.call(elms, 0).map(function (v, i, a) {
		return gAllFiles[v.value];
	});
	return values;
}

function readSelectedFiles() {
	let sl = getCbxSelectedFiles();
	readCSVs(sl);
}

function refreshDisplayEls() {
	$('.dResults .lgMean .print').html(lgMean.toFixed(decPrec));
	$('.dResults .ltMean .print').html(ltMean.toFixed(decPrec));
	$('.dResults .files-count').html(`(${gFilesToRead.length} files)`)
	$('.selecTools .files-count').html(`(${gFilesToRead.length})`)
	$('#slctFiles2ReadMlti').html('');
	$('#divFiles2ReadMlti ul').html('');
	for (let idx = 0; idx < gAllFiles.length; idx++) {
		const file = gAllFiles[idx];
		const isSelected = gFilesToRead.includes(file);
		const li = `
		<li class="${isSelected ? 'selected' : ''}">
			<label> 
				<input type="checkbox" name="selectedFileIdxes" value="${idx}" ${gFilesToRead.includes(file) ? 'checked' : ''} onchange="readSelectedFiles();return false;"> 
				<span class="f-idx">${idx + 1}.</span> <span class="f-name"> ${file.name} </span> 
			</label>
			<div class="actn-btns" >
				<button onclick="readCSVs([gAllFiles[${idx}]]);return false;">Read</button>
				<button onclick="removeFileWithIndex(${idx});refreshDisplayEls();return false;">&#10060; Remove</button>
			</div>
		</li>`;
		$('#divFiles2ReadMlti ul').append(li);
	}
	$('#cbx_slctAll').prop('checked', (gAllFiles.length && gAllFiles.length == gFilesToRead.length && gAllFiles.includes(gFilesToRead[gFilesToRead.length - 1])));
}

try {
	let tfiles = JSON.parse(sessionStorage.getItem('gAllFiles'));
	gAllFiles = isArray(tfiles) ? tfiles : [];
} catch (expt) { gAllFiles = [] };
